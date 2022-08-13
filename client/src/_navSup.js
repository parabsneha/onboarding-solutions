import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilUser,
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilPeople,
  cilTask
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _navSup = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboardSup',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    
  },
  {
    component: CNavTitle,
    name: 'Task',
  },
  {
    component: CNavItem,
    name: 'Tasks',
    to: '/task/SupTasksList',
    icon: <CIcon icon={cilTask} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Employees',
  },
  {
    component: CNavItem,
    name: 'Employees',
    to: '/theme/Employees',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  
]

export default _navSup
