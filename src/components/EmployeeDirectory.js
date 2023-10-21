import React from 'react'
import EmployeeCreate from './EmployeeCreate'
import EmployeeSearch from './EmployeeSearch'
import EmployeeTable from './EmployeeTable'
import Navbar from './Navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UpdateEmployee from './UpdateEmployee'
import UpcomingRetirement from './UpComingRetirement'

function EmployeeDirectory() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<EmployeeTable />} />
          <Route path="/create_employee" element={<EmployeeCreate />} />
          <Route path="/search_employee" element={<EmployeeSearch />} />
          <Route path="/update_employee/:id" element={<UpdateEmployee />} />
          <Route path="/upcomingRetired" element={<UpcomingRetirement />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default EmployeeDirectory