import { createContext, useContext, useState, useEffect } from 'react'
import brandApi from '../api/brandApi.js'

const BrandContext = createContext(null);
export function BrandProvider({children}){
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        const fetchBrands = async () => {
            try {
                const res = await brandApi.getAll();
                setBrands(res.data || []);
            }catch (err){
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchBrands()
    }, [])

    return (
        <BrandContext.Provider value = {{brands, loading}}>
            {children}
        </BrandContext.Provider>
    )
}

export const useBrands = () => useContext(BrandContext);