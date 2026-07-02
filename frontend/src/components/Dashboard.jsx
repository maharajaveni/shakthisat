import React, { useState, useEffect } from 'react';
import { Search, Calendar, FileText, Plus, Trash2, ArrowLeft, ArrowRight, RefreshCw, Users, ShieldAlert, Award } from 'lucide-react';
import { API_BASE_URL } from '../config';

function Dashboard({ token, user }) {
  const [submissions, setSubmissions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [category, setCategory] = useState('all'); // 'all', 'school', 'college', 'public'
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [schoolsList, setSchoolsList] = useState([]);
  const [collegesList, setCollegesList] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('');
  
  const [page, setPage] = useState(1);
  const limit = 15;

  // Stats
  const [stats, setStats] = useState({ total: 0, today: 0 });

  // Superadmin: Admin accounts management states
  const [adminsList, setAdminsList] = useState([]);
  const [newAdminUser, setNewAdminUser] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newAdminRole, setNewAdminRole] = useState('admin');
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState('');

  // Fetch unique filter values (schools & colleges) from API
  const fetchFilterOptions = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/filters`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSchoolsList(data.schools || []);
        setCollegesList(data.colleges || []);
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
    }
  };

  // Fetch submissions from API
  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      let url = `${API_BASE_URL}/api/admin/submissions?limit=${limit}&offset=${offset}&category=${category}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      if (category === 'school' && selectedSchool) {
        url += `&schoolName=${encodeURIComponent(selectedSchool)}`;
      }
      if (category === 'college' && selectedCollege) {
        url += `&collegeName=${encodeURIComponent(selectedCollege)}`;
      }

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmissions(data.submissions);
        setTotalCount(data.totalCount);
        
        const total = data.totalCount;
        const todayStr = new Date().toISOString().split('T')[0];
        
        let urlToday = `${API_BASE_URL}/api/admin/submissions?startDate=${todayStr}&limit=1&category=${category}`;
        if (category === 'school' && selectedSchool) {
          urlToday += `&schoolName=${encodeURIComponent(selectedSchool)}`;
        }
        if (category === 'college' && selectedCollege) {
          urlToday += `&collegeName=${encodeURIComponent(selectedCollege)}`;
        }
        const resToday = await fetch(urlToday, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const dataToday = await resToday.json();
        
        setStats({
          total: search || startDate || endDate || (category === 'school' && selectedSchool) || (category === 'college' && selectedCollege) ? stats.total : total,
          today: dataToday.success ? dataToday.totalCount : 0
        });
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch admins list (Superadmin only)
  const fetchAdmins = async () => {
    if (user.role !== 'superadmin') return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminsList(data.users);
      }
    } catch (err) {
      console.error('Error fetching admin list:', err);
    }
  };

  // Run searches and pagination updates
  useEffect(() => {
    fetchSubmissions();
  }, [search, startDate, endDate, page, category, selectedSchool, selectedCollege]);

  // Run dynamic dropdown filters fetch when category changes
  useEffect(() => {
    if (category === 'school' || category === 'college') {
      fetchFilterOptions();
    }
  }, [category]);

  // Run initial page mount loads
  useEffect(() => {
    fetchAdmins();
    fetchFilterOptions();
    const loadInitialStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/submissions?limit=1&category=${category}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setStats(prev => ({ ...prev, total: data.totalCount }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadInitialStats();
  }, []);

  const handleCategoryChange = (newCat) => {
    setCategory(newCat);
    setSelectedSchool('');
    setSelectedCollege('');
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
    setSelectedSchool('');
    setSelectedCollege('');
    setPage(1);
  };

  // Export to CSV or Excel
  const handleExport = async (format) => {
    try {
      let url = `${API_BASE_URL}/api/admin/submissions?limit=100000&category=${category}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      if (category === 'school' && selectedSchool) {
        url += `&schoolName=${encodeURIComponent(selectedSchool)}`;
      }
      if (category === 'college' && selectedCollege) {
        url += `&collegeName=${encodeURIComponent(selectedCollege)}`;
      }

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        let fileContent = '';
        const filename = `SakthiSAT_Submissions_${category.toUpperCase()}_${new Date().toISOString().split('T')[0]}`;
        
        if (format === 'csv') {
          // CSV construction
          if (category === 'school') {
            fileContent += 'Submission ID,Participant Name,School Name,Sakthi Definition,Registration Timestamp (UTC)\r\n';
            data.submissions.forEach(row => {
              const id = row.id;
              const name = `"${row.fullName.replace(/"/g, '""')}"`;
              const school = `"${(row.schoolName || '').replace(/"/g, '""')}"`;
              const definition = `"${row.shakthiResponse.replace(/"/g, '""')}"`;
              const date = row.createdAt;
              fileContent += `${id},${name},${school},${definition},${date}\r\n`;
            });
          } else if (category === 'college') {
            fileContent += 'Submission ID,Participant Name,College Name,Email Address,Phone Number,Sakthi Definition,Registration Timestamp (UTC)\r\n';
            data.submissions.forEach(row => {
              const id = row.id;
              const name = `"${row.fullName.replace(/"/g, '""')}"`;
              const college = `"${(row.collegeName || '').replace(/"/g, '""')}"`;
              const emailAddr = `"${(row.email || '').replace(/"/g, '""')}"`;
              const phoneNum = `"${(row.phone || '').replace(/"/g, '""')}"`;
              const definition = `"${row.shakthiResponse.replace(/"/g, '""')}"`;
              const date = row.createdAt;
              fileContent += `${id},${name},${college},${emailAddr},${phoneNum},${definition},${date}\r\n`;
            });
          } else if (category === 'public') {
            fileContent += 'Submission ID,Participant Name,Email Address,Phone Number,Sakthi Definition,Registration Timestamp (UTC)\r\n';
            data.submissions.forEach(row => {
              const id = row.id;
              const name = `"${row.fullName.replace(/"/g, '""')}"`;
              const emailAddr = `"${(row.email || '').replace(/"/g, '""')}"`;
              const phoneNum = `"${(row.phone || '').replace(/"/g, '""')}"`;
              const definition = `"${row.shakthiResponse.replace(/"/g, '""')}"`;
              const date = row.createdAt;
              fileContent += `${id},${name},${emailAddr},${phoneNum},${definition},${date}\r\n`;
            });
          } else { // 'all'
            fileContent += 'Submission ID,Category,Participant Name,School Name,College Name,Email Address,Phone Number,Sakthi Definition,Registration Timestamp (UTC)\r\n';
            data.submissions.forEach(row => {
              const id = row.id;
              const cat = row.category;
              const name = `"${row.fullName.replace(/"/g, '""')}"`;
              const school = `"${(row.schoolName || '').replace(/"/g, '""')}"`;
              const college = `"${(row.collegeName || '').replace(/"/g, '""')}"`;
              const emailAddr = `"${(row.email || '').replace(/"/g, '""')}"`;
              const phoneNum = `"${(row.phone || '').replace(/"/g, '""')}"`;
              const definition = `"${row.shakthiResponse.replace(/"/g, '""')}"`;
              const date = row.createdAt;
              fileContent += `${id},${cat},${name},${school},${college},${emailAddr},${phoneNum},${definition},${date}\r\n`;
            });
          }
          
          const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' });
          triggerDownload(blob, `${filename}.csv`);
        } else {
          // Excel (XLS) representation using HTML table format
          fileContent += `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
          fileContent += `<head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Submissions</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head>`;
          fileContent += `<body>`;
          fileContent += `<table border="1" style="border-collapse:collapse; font-family: Arial, sans-serif;">`;
          
          if (category === 'school') {
            fileContent += `<tr style="background-color: #3d1b5b; color: #ffffff; font-weight: bold;">`;
            fileContent += `<th>Submission ID</th><th>Participant Name</th><th>School Name</th><th>Sakthi Definition</th><th>Registration Date</th>`;
            fileContent += `</tr>`;
            data.submissions.forEach(row => {
              fileContent += `<tr>`;
              fileContent += `<td>${row.id}</td>`;
              fileContent += `<td>${escapeHtml(row.fullName)}</td>`;
              fileContent += `<td>${escapeHtml(row.schoolName || '')}</td>`;
              fileContent += `<td>${escapeHtml(row.shakthiResponse)}</td>`;
              fileContent += `<td>${new Date(row.createdAt).toLocaleString()}</td>`;
              fileContent += `</tr>`;
            });
          } else if (category === 'college') {
            fileContent += `<tr style="background-color: #3d1b5b; color: #ffffff; font-weight: bold;">`;
            fileContent += `<th>Submission ID</th><th>Participant Name</th><th>College Name</th><th>Email Address</th><th>Phone Number</th><th>Sakthi Definition</th><th>Registration Date</th>`;
            fileContent += `</tr>`;
            data.submissions.forEach(row => {
              fileContent += `<tr>`;
              fileContent += `<td>${row.id}</td>`;
              fileContent += `<td>${escapeHtml(row.fullName)}</td>`;
              fileContent += `<td>${escapeHtml(row.collegeName || '')}</td>`;
              fileContent += `<td>${escapeHtml(row.email || '')}</td>`;
              fileContent += `<td>${escapeHtml(row.phone || '')}</td>`;
              fileContent += `<td>${escapeHtml(row.shakthiResponse)}</td>`;
              fileContent += `<td>${new Date(row.createdAt).toLocaleString()}</td>`;
              fileContent += `</tr>`;
            });
          } else if (category === 'public') {
            fileContent += `<tr style="background-color: #3d1b5b; color: #ffffff; font-weight: bold;">`;
            fileContent += `<th>Submission ID</th><th>Participant Name</th><th>Email Address</th><th>Phone Number</th><th>Sakthi Definition</th><th>Registration Date</th>`;
            fileContent += `</tr>`;
            data.submissions.forEach(row => {
              fileContent += `<tr>`;
              fileContent += `<td>${row.id}</td>`;
              fileContent += `<td>${escapeHtml(row.fullName)}</td>`;
              fileContent += `<td>${escapeHtml(row.email || '')}</td>`;
              fileContent += `<td>${escapeHtml(row.phone || '')}</td>`;
              fileContent += `<td>${escapeHtml(row.shakthiResponse)}</td>`;
              fileContent += `<td>${new Date(row.createdAt).toLocaleString()}</td>`;
              fileContent += `</tr>`;
            });
          } else { // 'all'
            fileContent += `<tr style="background-color: #3d1b5b; color: #ffffff; font-weight: bold;">`;
            fileContent += `<th>Submission ID</th><th>Category</th><th>Participant Name</th><th>School Name</th><th>College Name</th><th>Email Address</th><th>Phone Number</th><th>Sakthi Definition</th><th>Registration Date</th>`;
            fileContent += `</tr>`;
            data.submissions.forEach(row => {
              fileContent += `<tr>`;
              fileContent += `<td>${row.id}</td>`;
              fileContent += `<td style="text-transform: uppercase;">${row.category}</td>`;
              fileContent += `<td>${escapeHtml(row.fullName)}</td>`;
              fileContent += `<td>${escapeHtml(row.schoolName || '')}</td>`;
              fileContent += `<td>${escapeHtml(row.collegeName || '')}</td>`;
              fileContent += `<td>${escapeHtml(row.email || '')}</td>`;
              fileContent += `<td>${escapeHtml(row.phone || '')}</td>`;
              fileContent += `<td>${escapeHtml(row.shakthiResponse)}</td>`;
              fileContent += `<td>${new Date(row.createdAt).toLocaleString()}</td>`;
              fileContent += `</tr>`;
            });
          }
          
          fileContent += `</table></body></html>`;
          
          const blob = new Blob([fileContent], { type: 'application/vnd.ms-excel;charset=utf-8;' });
          triggerDownload(blob, `${filename}.xls`);
        }
      }
    } catch (err) {
      console.error('Error during data export:', err);
      alert('Failed to export data. Please try again.');
    }
  };

  const triggerDownload = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const escapeHtml = (text) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  // Add new admin user (Superadmin only)
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setAdminError('');
    setAdminSuccess('');

    if (!newAdminUser.trim() || !newAdminPass) {
      setAdminError('Please fill in all fields.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          username: newAdminUser.trim(),
          password: newAdminPass,
          role: newAdminRole
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setAdminSuccess(data.message);
        setNewAdminUser('');
        setNewAdminPass('');
        setNewAdminRole('admin');
        fetchAdmins();
      } else {
        setAdminError(data.message || 'Failed to create admin.');
      }
    } catch (err) {
      console.error(err);
      setAdminError('Error connecting to backend.');
    }
  };

  // Clear all registrations (Superadmin only)
  const handleClearSubmissions = async () => {
    if (!window.confirm('⚠️ WARNING: Are you absolutely sure you want to clear all participant registrations? This action is permanent and cannot be undone.')) {
      return;
    }
    if (!window.confirm('PROMPT: Double-confirm. Clear all registrations?')) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/submissions/clear`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message);
        setPage(1);
        fetchSubmissions();
        fetchFilterOptions();
      } else {
        alert(data.message || 'Failed to clear registrations.');
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to backend server.');
    }
  };

  // Delete admin user (Superadmin only)
  const handleDeleteAdmin = async (id, username) => {
    if (!window.confirm(`Are you sure you want to delete admin account '${username}'?`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        fetchAdmins();
      } else {
        alert(data.message || 'Failed to delete admin account.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalPages = Math.ceil(totalCount / limit) || 1;

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <h2 className="title-gold-gradient" style={{ fontSize: '2rem', fontFamily: 'Cinzel, serif' }}>
            Administrative Panel
          </h2>
          <p style={{ color: '#b0a4c0', fontSize: '0.9rem' }}>
            Monitor participant registrations and download certificates logs.
          </p>
        </div>
      </div>

      {/* Stats Summary cards */}
      <div className="stats-bar">
        <div className="stat-card glass-card">
          <div className="stat-icon">
            <Award size={24} />
          </div>
          <div>
            <div className="stat-num">{stats.total}</div>
            <div className="stat-label">Total Registrations</div>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon">
            <RefreshCw size={24} />
          </div>
          <div>
            <div className="stat-num">{stats.today}</div>
            <div className="stat-label">Today's Registrations</div>
          </div>
        </div>

        {user.role === 'superadmin' && (
          <div className="stat-card glass-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div>
              <div className="stat-num">{adminsList.length}</div>
              <div className="stat-label">Active Administrators</div>
            </div>
          </div>
        )}
      </div>

      {/* Category Navigation Tabs for Dashboard */}
      <div className="category-tabs-container" style={{ marginTop: '1.5rem' }}>
        <div className="category-tabs" style={{ maxWidth: '640px' }}>
          <button
            type="button"
            className={`category-tab ${category === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('all')}
          >
            All Submissions
          </button>
          <button
            type="button"
            className={`category-tab ${category === 'school' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('school')}
          >
            School Students
          </button>
          <button
            type="button"
            className={`category-tab ${category === 'college' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('college')}
          >
            College Students
          </button>
          <button
            type="button"
            className={`category-tab ${category === 'public' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('public')}
          >
            Public / Others
          </button>
        </div>
      </div>

      {/* Search and Filters Controls */}
      <div className="controls-card glass-card">
        <div className="filters-grid">
          <div className="filter-input-group">
            <label className="filter-label">Search Records</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="filter-control"
                placeholder="Search by name or response..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(212, 175, 55, 0.5)' }} />
            </div>
          </div>

          {/* Dynamic Dropdown Filter: School Names */}
          {category === 'school' && (
            <div className="filter-input-group dropdown-filter-group">
              <label className="filter-label">Filter by School</label>
              <select
                className="filter-control filter-select"
                value={selectedSchool}
                onChange={(e) => { setSelectedSchool(e.target.value); setPage(1); }}
              >
                <option value="">-- All Schools --</option>
                {schoolsList.map(sch => (
                  <option key={sch} value={sch}>{sch}</option>
                ))}
              </select>
            </div>
          )}

          {/* Dynamic Dropdown Filter: College Names */}
          {category === 'college' && (
            <div className="filter-input-group dropdown-filter-group">
              <label className="filter-label">Filter by College</label>
              <select
                className="filter-control filter-select"
                value={selectedCollege}
                onChange={(e) => { setSelectedCollege(e.target.value); setPage(1); }}
              >
                <option value="">-- All Colleges --</option>
                {collegesList.map(clg => (
                  <option key={clg} value={clg}>{clg}</option>
                ))}
              </select>
            </div>
          )}

          <div className="filter-input-group">
            <label className="filter-label">From Date</label>
            <input
              type="date"
              className="filter-control"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(1); }}
            />
          </div>

          <div className="filter-input-group">
            <label className="filter-label">To Date</label>
            <input
              type="date"
              className="filter-control"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(1); }}
            />
          </div>

          <div className="btn-row">
            <button className="action-btn" onClick={handleResetFilters}>
              Reset
            </button>
            <button className="action-btn export-btn" onClick={() => handleExport('csv')}>
              <FileText size={16} />
              CSV
            </button>
            <button className="action-btn export-btn" onClick={() => handleExport('excel')}>
              <FileText size={16} />
              Excel
            </button>
            {user.role === 'superadmin' && (
              <button className="action-btn" onClick={handleClearSubmissions} style={{ background: 'rgba(235, 64, 52, 0.1)', color: '#ff4c4c', border: '1px solid rgba(235, 64, 52, 0.3)' }}>
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Submissions Data Table */}
      <div className="table-responsive">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#d4af37' }}>
            <RefreshCw className="animate-spin" size={32} style={{ margin: '0 auto 1rem', animation: 'spin 1.5s linear infinite' }} />
            Loading submissions...
          </div>
        ) : submissions.length === 0 ? (
          <div className="no-records">
            No registrations found matching the criteria.
          </div>
        ) : (
          <table className="data-table">
            <thead>
              {category === 'school' && (
                <tr>
                  <th>ID</th>
                  <th>Participant Name</th>
                  <th>School Name</th>
                  <th>"Sakthi is..."</th>
                  <th>Registration Date (Local)</th>
                </tr>
              )}
              {category === 'college' && (
                <tr>
                  <th>ID</th>
                  <th>Participant Name</th>
                  <th>College Name</th>
                  <th>Email Address</th>
                  <th>Phone Number</th>
                  <th>"Sakthi is..."</th>
                  <th>Registration Date (Local)</th>
                </tr>
              )}
              {category === 'public' && (
                <tr>
                  <th>ID</th>
                  <th>Participant Name</th>
                  <th>Email Address</th>
                  <th>Phone Number</th>
                  <th>"Sakthi is..."</th>
                  <th>Registration Date (Local)</th>
                </tr>
              )}
              {category === 'all' && (
                <tr>
                  <th>ID</th>
                  <th>Category</th>
                  <th>Participant Name</th>
                  <th>Details / Institution</th>
                  <th>"Sakthi is..."</th>
                  <th>Registration Date (Local)</th>
                </tr>
              )}
            </thead>
            <tbody>
              {submissions.map((sub) => (
                <tr key={`${sub.category}-${sub.id}`}>
                  <td style={{ fontWeight: 'bold', color: 'rgba(212, 175, 55, 0.8)' }}>#{sub.id}</td>
                  
                  {/* Category cell (All submissions only) */}
                  {category === 'all' && (
                    <td>
                      <span className={`category-badge ${sub.category}`}>
                        {sub.category}
                      </span>
                    </td>
                  )}

                  <td style={{ fontWeight: '500' }}>{sub.fullName}</td>
                  
                  {/* Conditional columns for School category */}
                  {category === 'school' && (
                    <td style={{ color: '#b0a4c0', fontSize: '0.9rem' }}>{sub.schoolName}</td>
                  )}

                  {/* Conditional columns for College category */}
                  {category === 'college' && (
                    <>
                      <td style={{ color: '#b0a4c0', fontSize: '0.9rem' }}>{sub.collegeName}</td>
                      <td style={{ color: '#b0a4c0', fontSize: '0.9rem' }}>{sub.email}</td>
                      <td style={{ color: '#b0a4c0', fontSize: '0.9rem' }}>{sub.phone}</td>
                    </>
                  )}

                  {/* Conditional columns for Public/Others category */}
                  {category === 'public' && (
                    <>
                      <td style={{ color: '#b0a4c0', fontSize: '0.9rem' }}>{sub.email}</td>
                      <td style={{ color: '#b0a4c0', fontSize: '0.9rem' }}>{sub.phone}</td>
                    </>
                  )}

                  {/* Unified Contact/Institution details for All submissions category */}
                  {category === 'all' && (
                    <td style={{ color: '#b0a4c0', fontSize: '0.85rem', lineHeight: '1.4' }}>
                      {sub.category === 'school' && (
                        <span><b>School:</b> {sub.schoolName}</span>
                      )}
                      {sub.category === 'college' && (
                        <div>
                          <div><b>College:</b> {sub.collegeName}</div>
                          <div><b>Contact:</b> {sub.email} | {sub.phone}</div>
                        </div>
                      )}
                      {sub.category === 'public' && (
                        <span><b>Contact:</b> {sub.email} | {sub.phone}</span>
                      )}
                    </td>
                  )}

                  <td>
                    <span style={{ fontStyle: 'italic', color: '#ffd700', background: 'rgba(212,175,55,0.08)', padding: '4px 8px', borderRadius: '4px', border: '0.5px solid rgba(212,175,55,0.15)' }}>
                      {sub.shakthiResponse}
                    </span>
                  </td>
                  <td>{new Date(sub.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {submissions.length > 0 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} records
          </div>
          <div className="pagination-btns">
            <button
              className="action-btn"
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              disabled={page === 1}
              style={{ padding: '0.5rem 1rem', height: '36px' }}
            >
              <ArrowLeft size={16} />
            </button>
            <span style={{ alignSelf: 'center', padding: '0 1rem', fontSize: '0.9rem', color: '#b0a4c0' }}>
              Page {page} of {totalPages}
            </span>
            <button
              className="action-btn"
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              style={{ padding: '0.5rem 1rem', height: '36px' }}
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {user.role === 'superadmin' && (
        <div className="admin-manager-grid">
          <div className="admin-card glass-card">
            <h3 className="section-title">
              <Plus size={18} style={{ marginRight: '6px', verticalAlign: 'text-bottom', color: '#d4af37' }} />
              Create Administrator
            </h3>
            
            <form onSubmit={handleCreateAdmin}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Username</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Username"
                  value={newAdminUser}
                  onChange={(e) => setNewAdminUser(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Password</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Password"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.8rem' }}>Access Level / Role</label>
                <select
                  className="form-input"
                  value={newAdminRole}
                  onChange={(e) => setNewAdminRole(e.target.value)}
                  style={{ background: 'rgba(12, 4, 20, 0.7)' }}
                >
                  <option value="admin">Admin (Read-only data access)</option>
                  <option value="superadmin">Superadmin (Read/Write & User management)</option>
                </select>
              </div>

              {adminError && <div className="error-msg" style={{ marginBottom: '1rem' }}><ShieldAlert size={16} />{adminError}</div>}
              {adminSuccess && <div style={{ color: '#00cc66', fontSize: '0.85rem', marginBottom: '1rem' }}>{adminSuccess}</div>}

              <button type="submit" className="submit-btn" style={{ marginTop: '1rem', padding: '0.75rem' }}>
                Create Administrator Account
              </button>
            </form>
          </div>

          <div className="admin-card glass-card">
            <h3 className="section-title">
              <Users size={18} style={{ marginRight: '6px', verticalAlign: 'text-bottom', color: '#d4af37' }} />
              Manage Administrators
            </h3>

            <div style={{ maxHeight: '310px', overflowY: 'auto' }}>
              {adminsList.map(adm => (
                <div className="user-item" key={adm.id}>
                  <div className="user-info">
                    <span className="user-name">{adm.username}</span>
                    <span style={{ fontSize: '0.75rem' }}>
                      Role: <span style={{ color: adm.role === 'superadmin' ? '#ffd700' : '#b0a4c0', fontWeight: 'bold' }}>{adm.role}</span>
                    </span>
                  </div>
                  
                  <button
                    className="delete-user-btn"
                    onClick={() => handleDeleteAdmin(adm.id, adm.username)}
                    disabled={adm.id === 1 || adm.username === user.username}
                    title={adm.id === 1 ? 'Primary superadmin cannot be deleted' : adm.username === user.username ? 'You cannot delete yourself' : 'Delete user'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
