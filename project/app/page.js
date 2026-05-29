'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Home() {
  const [userName, setUserName] = useState("Francesco")

  // Il nostro "Inventario" diviso per categorie
  const [inventory, setInventory] = useState({
    top: [],
    bottom: [],
    shoes: [],
    accessory: []
  })

  // Gli indici dei vestiti attualmente "indossati"
  const [equipped, setEquipped] = useState({
    top: 0,
    bottom: 0,
    shoes: 0,
    accessory: 0
  })

  // Z-Index per la stratificazione perfetta
  const zLayers = {
    bottom: 10,  // I pantaloni vanno sotto
    top: 20,     // Le maglie coprono i pantaloni
    shoes: 30,   // Scarpe
    accessory: 40 // Accessori (occhiali, cappelli) sopra tutto
  }
  // Parametri di posizionamento e grandezza (da calibrare)
  const fitParams = {
    top: { width: '55%', height: '50%', top: '25%', left: '22.5%' },
    bottom: { width: '45%', height: '40%', top: '50%', left: '27.5%' },
    shoes: { width: '50%', height: '15%', top: '82%', left: '25%' },
    accessory: { width: '35%', height: '20%', top: '5%', left: '32.5%' }
  }

  // Peschiamo i vestiti da Supabase all'avvio
  useEffect(() => {
    async function fetchArmadio() {
      const { data, error } = await supabase
        .from('clothings')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error("Errore fetch:", error)
        return
      }

      // Dividiamo i vestiti nei vari "cassetti"
      if (data) {
        const grouped = { top: [], bottom: [], shoes: [], accessory: [] }
        data.forEach(item => {
          if (grouped[item.type]) {
            grouped[item.type].push(item)
          }
        })
        setInventory(grouped)
      }
    }

    fetchArmadio()
  }, [])

  // Funzione per scorrere i vestiti di una categoria
  const cycleItem = (type) => {
    setEquipped(prev => {
      const maxItems = inventory[type].length
      if (maxItems === 0) return prev
      return { ...prev, [type]: (prev[type] + 1) % maxItems }
    })
  }

  return (
    <div className="home-wrapper">
      {/* BACKGROUND ORB */}
      <div className="gemini-orb"></div>

      <div style={{ display: 'flex', gap: '4rem', alignItems: 'center', zIndex: 10 }}>

        {/* GEMELLO VIRTUALE (Area Principale) */}
        <div className="avatar-container" style={{ position: 'relative', width: '300px', height: '450px' }}>

          <div className="bubble-pop" style={{ top: '-40px', right: '-80px', zIndex: 50 }}>
            Ciao, {userName}! 👋
          </div>

          <div style={{
            width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden',
            border: '2px solid var(--sidebar-border)', backgroundColor: 'transparent',
            boxShadow: '0 0 30px rgba(107,31,228,0.2)', position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>

            {/* LIVELLI DINAMICI DEI VESTITI SOPRA L'OMINO */}
            {Object.keys(inventory).map(type => {
              const items = inventory[type]
              if (items.length === 0) return null

              const currentItem = items[equipped[type]]

              return (
                <img
                  key={type}
                  src={currentItem.image_url}
                  alt={currentItem.name}
                  style={{
                    position: 'absolute',
                    // Usiamo i parametri specifici per categoria invece di 100%
                    top: fitParams[type].top,
                    left: fitParams[type].left,
                    width: fitParams[type].width,
                    height: fitParams[type].height,
                    objectFit: 'contain',
                    zIndex: zLayers[type],
                    transition: 'opacity 0.3s ease',
                    pointerEvents: 'none'
                  }}
                />
              )
            })}
          </div>
          <div className="avatar-shadow"></div>
        </div>

        {/* CONTROLLI EQUIPAGGIAMENTO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '2rem', borderRadius: '1.5rem', backdropFilter: 'blur(10px)', border: '1px solid var(--sidebar-border)' }}>
          <h3 style={{ color: 'var(--accent-purple)', margin: '0 0 1rem 0', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.9rem' }}>
            Terminale Outfit
          </h3>

          {Object.keys(inventory).map(type => {
            const count = inventory[type].length
            return (
              <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', borderBottom: '1px solid rgba(107, 31, 228, 0.2)', paddingBottom: '0.5rem' }}>
                <div>
                  <p style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{type}</p>
                  <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>
                    {count > 0 ? inventory[type][equipped[type]].name : 'Nessun capo'}
                  </p>
                </div>
                <button
                  onClick={() => cycleItem(type)}
                  disabled={count <= 1}
                  style={{
                    backgroundColor: count > 1 ? 'var(--accent-purple)' : 'transparent',
                    color: 'white', border: count > 1 ? 'none' : '1px solid rgba(255,255,255,0.2)',
                    padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: count > 1 ? 'pointer' : 'not-allowed',
                    fontWeight: 'bold', transition: 'all 0.2s'
                  }}
                >
                  Cambia
                </button>
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}