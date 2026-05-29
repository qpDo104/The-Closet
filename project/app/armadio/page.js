'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function Armadio() {
    const [clothes, setClothes] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeFilter, setActiveFilter] = useState('all')

    useEffect(() => {
        fetchClothes()
    }, [])

    async function fetchClothes() {
        try {
            const { data, error } = await supabase
                .from('clothings')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setClothes(data || [])
        } catch (error) {
            console.error('Errore nel caricamento del guardaroba:', error)
        } finally {
            setLoading(false)
        }
    }

    // Filtra i vestiti in base al bottone cliccato
    const filteredClothes = activeFilter === 'all'
        ? clothes
        : clothes.filter(item => item.type === activeFilter)

    return (
        <div className="home-wrapper" style={{ overflowY: 'auto', display: 'block' }}>
            <div className="wardrobe-container">

                <div className="wardrobe-header">
                    <div>
                        <h1 style={{ fontSize: '2.5rem', color: 'var(--accent-purple)', marginBottom: '0.5rem' }}>Il tuo Guardaroba</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Hai {clothes.length} capi catalogati nel database.</p>
                    </div>

                    {/* BOTTONI FILTRO */}
                    <div className="filters">
                        <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>Tutti</button>
                        <button className={`filter-btn ${activeFilter === 'top' ? 'active' : ''}`} onClick={() => setActiveFilter('top')}>Top</button>
                        <button className={`filter-btn ${activeFilter === 'bottom' ? 'active' : ''}`} onClick={() => setActiveFilter('bottom')}>Bottom</button>
                        <button className={`filter-btn ${activeFilter === 'shoes' ? 'active' : ''}`} onClick={() => setActiveFilter('shoes')}>Scarpe</button>
                        <button className={`filter-btn ${activeFilter === 'accessory' ? 'active' : ''}`} onClick={() => setActiveFilter('accessory')}>Accessori</button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--accent-purple)' }}>
                        <div className="nav-dot" style={{ backgroundColor: 'var(--accent-purple)', width: '20px', height: '20px', margin: '0 auto', animation: 'pulse 1s infinite' }}></div>
                        <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Sincronizzazione database...</p>
                    </div>
                ) : filteredClothes.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '5rem', color: 'var(--text-muted)' }}>
                        <p>Nessun capo trovato per questa categoria.</p>
                    </div>
                ) : (
                    <div className="clothes-grid">
                        {filteredClothes.map((item) => (
                            <div key={item.id} className="clothing-card">
                                <div className="card-image-container">
                                    {/* L'immagine in PNG scontornata */}
                                    <img src={item.image_url} alt={item.name} className="card-image" />
                                </div>
                                <div className="card-info">
                                    <p className="card-type">{item.type}</p>
                                    <h3 className="card-name" title={item.name}>{item.name}</h3>
                                    <div className="card-footer">
                                        <span className="card-style">{item.style}</span>
                                        <div
                                            className="color-dot"
                                            style={{ backgroundColor: item.color_hex }}
                                            title={item.color_name}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}