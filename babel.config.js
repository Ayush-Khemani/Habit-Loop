// Use Babel instead of SWC (fixes "next-swc.win32-x64-msvc.node is not a valid Win32 application" on Windows)
module.exports = {
  presets: ['next/babel'],
}
