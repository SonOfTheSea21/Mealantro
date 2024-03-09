import React, { useEffect } from 'react';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../Footer/Footer';

import Logo from '../../Logo'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { useState } from 'react';
import './Dashboard.css'
import { useParams, useNavigate } from 'react-router-dom';


function Dashboard() {
    const {id} = useParams();
    console.log(id);

    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch(`http://localhost:5000/recipes/logs/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data.success && data.data) {
                    console.log(data.data)
                    setLogs(data.data);
                } else {
                    console.error('No logs found');
                }
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };

        fetchLogs();
    }, []);

    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch(`http://localhost:5000/recipes/reports`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data.success && data.data) {
                    
                    setReports(data.data);

                    console.log("jaska", data.data);
                } else {
                    console.error('No reports found');
                }
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
    }, []);

    const navigate = useNavigate();

const handleReportClick = async (reportId, recipeId, reportName) => {
  try {
    // Update the report's status to 'sorted'
    const response = await fetch(`http://localhost:5000/recipes/reports/update/${reportId}`, {
      method: 'PUT',
    });

    if (!response.ok) {
      throw new Error('Failed to update report status');
    }

    // If the status update is successful, navigate to the recipe page
    navigate(`/Recipe/${id}/${reportName}`, {
        state: {rid: recipeId},
      });
  } catch (error) {
    console.error('Error handling report click:', error);
  }
};


  return (
    <>
    <Logo id={{ value: id }} />
   <Navbar id={{ value: id }} /> 
   <div className="dcontainer">
    <h3>Complaints</h3>
   <table>
                    <thead>
                        <tr>
                            <th>Report ID</th>
                            <th>Complainer ID</th>
                            <th>Recipe ID</th>
                            <th>Description</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.report_id}>
                                <td>{report.report_id}</td>
                                <td>{report.complainer_id}</td>
                                <td>{report.recipe_id}</td>
                                <td>{report.description}</td>
                                <td>{report.status === 0 ? "Unsorted" : "Sorted"}</td>
                                <td>
      <button onClick={() => handleReportClick(report.report_id, report.recipe_id, report.food_name)}>View & Mark Sorted</button>
    </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <h3>Logs</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Log ID</th>
                            <th>User ID</th>
                            <th>Category</th>
                            <th>Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log) => (
                            <tr key={log.log_id}>
                                <td>{log.log_id}</td>
                                <td>{log.user_id}</td>
                                <td>{log.category}</td>
                                <td>{log.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


   
    <Footer />
    </>

  );
}

export default Dashboard;