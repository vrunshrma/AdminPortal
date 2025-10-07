import React, { useState, useEffect } from 'react';
import { getAllEmployee } from '../authService/PrivateAuthService';
import '../styles/userlist.css'
import '../styles/loadingSpinner.css';
import LoadingSpinner from './LoadingSpinner';

const DashboardComponent = () => {
  const [userDetails, setUserDetails] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const usersPerPage = 10;

  useEffect(() => {
    getAllEmployee().then((employeeResponse) => {
      if (!employeeResponse.data) {
        throw new Error('No data received after login');
      }
      setUserDetails(employeeResponse.data.response || []);
      setIsLoading(false); // Set loading to false after data is fetched
    }).catch((error) => {
      console.error(error);
      setIsLoading(false); // Set loading to false in case of error
    });
  }, []);

  const formatDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const getStatusText = (isActive) => {
    return isActive ? "Active" : "Inactive";
  };

  if (isLoading) {
    return <LoadingSpinner />; // Show spinner when loading
  }

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userDetails.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className='container'>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="main-box clearfix">
              <h3>User Details:</h3>
              <div className="table-responsive">
                <table className="table user-list">
                  <thead>
                    <tr>
                      <th><span>User</span></th>
                      <th><span>Created</span></th>
                      <th className="text-center"><span>Status</span></th>
                      <th><span>Email</span></th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers && currentUsers.map((user, index) => (
                      <tr key={index}>
                        <td>
                          <img src={`https://bootdey.com/img/Content/avatar/avatar${(index % 8) + 1}.png`} alt="" />
                          <span className="user-name">{user.firstName} {user.lastName}</span>
                          <br />
                          <span className="user-subhead">Admin</span>
                        </td>
                        <td>
                          {formatDate(user.createDate)}
                        </td>
                        <td className="text-center">
                          <span className="label label-default">{getStatusText(user.isActive)}</span>
                        </td>
                        <td>
                          <a href="#">{user.username}</a>
                        </td>
                        <td style={{ width: '20%' }}>
                          <a href="#" className="table-link">
                            <span className="fa-stack">
                              <i className="fa fa-square fa-stack-2x"></i>
                              <i className="fa fa-search-plus fa-stack-1x fa-inverse"></i>
                            </span>
                          </a>
                          <a href="#" className="table-link">
                            <span className="fa-stack">
                              <i className="fa fa-square fa-stack-2x"></i>
                              <i className="fa fa-pencil fa-stack-1x fa-inverse"></i>
                            </span>
                          </a>
                          <a href="#" className="table-link danger">
                            <span className="fa-stack">
                              <i className="fa fa-square fa-stack-2x"></i>
                              <i className="fa fa-trash-o fa-stack-1x fa-inverse"></i>
                            </span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <ul className="pagination pull-right">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <a className="page-link" href="#" onClick={() => paginate(currentPage - 1)}>
                    <i className="fa fa-chevron-left"></i>
                  </a>
                </li>
                {Array.from({ length: Math.ceil(userDetails.length / usersPerPage) }, (_, i) => (
                  <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                    <a className="page-link" href="#" onClick={() => paginate(i + 1)}>{i + 1}</a>
                  </li>
                ))}
                <li className={`page-item ${currentPage === Math.ceil(userDetails.length / usersPerPage) ? 'disabled' : ''}`}>
                  <a className="page-link" href="#" onClick={() => paginate(currentPage + 1)}>
                    <i className="fa fa-chevron-right"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
