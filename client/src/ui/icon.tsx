import { React } from '../../utils/deps.ts'

export const CounterIcon = ({ size = 32 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
    <g fill="#fff">
      <path d="M8.2,15.6H6.8V10c-0.5,0.5-1.1,0.9-1.8,1.1V9.7c0.8-0.3,1.8-1.1,2.1-2h1.1V15.6z" />
      <path d="M19.3,9.8v1.4h-4.9c-0.1-2.2,3.2-3.6,3.5-5.6C18,4.1,15.8,4.2,16,5.7l-1.4-0.2c0.8-3.9,8.7-1.7,2,4.2H19.3z" />
      <path d="M14.5,18.6l1.4-0.2c0,1,1.1,1.6,1.8,0.8c0.8-0.9,0-2.7-1.3-2.1l0.2-1.2c2.7-0.2,0.1-3.6-0.6-0.8l-1.3-0.2,c0.6-4.2,7-1,3.4,1.6c2.5,0.7,1.2,4.1-1.1,4C15.8,20.3,14.7,19.7,14.5,18.6z" />
    </g>
    <g fill="none" stroke="#fff" stroke-width="1.5">
      <path d="M4.5,4C3.1,4,2,5.3,2,6.9v10.2C2,18.7,3.1,20,4.5,20h15c1.4,0,2.5-1.3,2.5-2.9V6.9C22,5.3,20.9,4,19.5,4H4.5z" />
      <line x1="12" y1="20" x2="12" y2="4" />
    </g>
  </svg>
)

export const AnalyticsIcon = ({ size = 32 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="#fff">
    <path d="M100,116.43a8,8,0,0,0,4-6.93v-72A8,8,0,0,0,93.34,30,104.06,104.06,0,0,0,25.73,147a8,8,0,0,0,4.52,5.81,7.86,7.86,0,0,0,3.35.74,8,8,0,0,0,4-1.07ZM88,49.62v55.26L40.12,132.51C40,131,40,129.48,40,128A88.12,88.12,0,0,1,88,49.62ZM128,24a8,8,0,0,0-8,8v91.82L41.19,169.73a8,8,0,0,0-2.87,11A104,104,0,1,0,128,24Zm0,192a88.47,88.47,0,0,1-71.49-36.68l75.52-44a8,8,0,0,0,4-6.92V40.36A88,88,0,0,1,128,216Z" />
  </svg>
)

export const UsersIcon = ({ size = 32 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 256" fill="#fff">
    <path d="M168,56a8,8,0,0,1,8-8h16V32a8,8,0,0,1,16,0V48h16a8,8,0,0,1,0,16H208V80a8,8,0,0,1-16,0V64H176A8,8,0,0,1,168,56Zm62.56,54.68a103.92,103.92,0,1,1-85.24-85.24,8,8,0,0,1-2.64,15.78A88.07,88.07,0,0,0,40,128a87.62,87.62,0,0,0,22.24,58.41A79.66,79.66,0,0,1,98.3,157.66a48,48,0,1,1,59.4,0,79.66,79.66,0,0,1,36.06,28.75A87.62,87.62,0,0,0,216,128a88.85,88.85,0,0,0-1.22-14.68,8,8,0,1,1,15.78-2.64ZM128,152a32,32,0,1,0-32-32A32,32,0,0,0,128,152Zm0,64a87.57,87.57,0,0,0,53.92-18.5,64,64,0,0,0-107.84,0A87.57,87.57,0,0,0,128,216Z" />
  </svg>
)

export const LoginIcon = ({ size = 32 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
    <g fill="none" stroke="#fff" stroke-width="1.5">
      <path d="M14,8V6c0-1.1-0.9-2-2-2H5C3.9,4,3,4.9,3,6v12c0,1.1,0.9,2,2,2h7c1.1,0,2-0.9,2-2v-2" />
      <path d="M12,9l-3,3h12" />
      <path d="M9,12l3,3" />
    </g>
  </svg>
)

export const LogoutIcon = ({ size = 32 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
    <g fill="none" stroke="#fff" stroke-width="1.5">
      <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
      <path d="M9 12h12l-3 -3" />
      <path d="M18 15l3 -3" />
    </g>
  </svg>
)

export const InfoIcon = ({ size = 32 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
    <circle fill="none" stroke="#fff" stroke-width="1.5" cx="12" cy="12" r="9" />
    <path fill="#fff" d="M11.2,8.8V7.3h1.6v1.5H11.2z M11.2,15.9V9.7h1.6v6.2H11.2z" />
  </svg>
)

export const ArrowUp = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill="none" viewBox="0 0 10 14">
    <path stroke="currentColor" stroke-width="2" d="M5 13V1m0 0L1 5m4-4 4 4"></path>
  </svg>
)

export const InstallDesktopIcon = ({ size = 32 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24">
    <path fill="#fff" d="m8,21v-2h-4c-.55,0-1.02-.2-1.41-.59s-.59-.86-.59-1.41V5c0-.55.2-1.02.59-1.41s.86-.59,1.41-.59h8v2H4v12h16v-3h2v3c0,.55-.2,1.02-.59,1.41s-.86.59-1.41.59h-4v2h-8Zm9-7l-5-5,1.4-1.4,2.6,2.58V3h2v7.18l2.6-2.58,1.4,1.4-5,5Z" />
  </svg>
)

export const InstallAndroidIcon = ({ size = 32 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="#fff">
    <polyline points="13.4 7.6 16 10.17 16 3 18 3 18 10.17 20.6 7.6 22 9 17 14" />
    <polygon points="17 14 12 9 13.4 7.6 16 10.17 16 3 18 3 18 10.17 20.6 7.6 22 9 17 14" />
    <path d="m8.5,13.42l.95,1.7c-1.4.79-2.33,2.27-2.45,3.88h10c-.12-1.6-1.05-3.09-2.45-3.88l.95-1.7-.5-.3-.97,1.75c-.93-.51-2.98-.54-4.05,0l-.97-1.75-.5.3Zm6.25,3.08v1h-1v-1h1Zm-4.5,1h-1v-1h1v1Z" />
    <path d="m6,22h12c1.1,0,2-.9,2-2v-4.94h-2v4.94H6V4h8.25v-2H6c-1.1,0-2,.9-2,2v16c0,1.1.9,2,2,2Z" />
  </svg>
)
