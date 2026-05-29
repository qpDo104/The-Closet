import './globals.css'

export const metadata = {
  title: 'The Closet | Gemello Virtuale',
  description: 'Il tuo armadio digitale potenziato',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>
        <div className="app-container">

          {/* AREA CONTENUTO PRINCIPALE */}
          <main className="main-content">
            {children}
          </main>

          {/* NAVBAR LATERALE DESTRA */}
          <aside className="sidebar">

            <div className="sidebar-header">
              <h1 className="brand-title">THE<span>CLOSET</span></h1>
              <p className="brand-subtitle">Virtual Twin Engine</p>
            </div>

            <nav className="nav-menu">
              <a href="/" className="nav-link">
                <span className="nav-dot"></span>
                <span>Hub Centrale</span>
              </a>
              <a href="/armadio" className="nav-link">
                <span className="nav-dot"></span>
                <span>Guardaroba</span>
              </a>
              <a href="/aggiungi" className="nav-link">
                <span className="nav-dot"></span>
                <span>Aggiungi Capo</span>
              </a>
            </nav>

            <div className="user-profile">
              <div className="user-avatar">U</div>
              <div className="user-info">
                <p className="name">Utente</p>
                <p className="status">Online</p>
              </div>
            </div>

          </aside>
        </div>
      </body>
    </html>
  )
}