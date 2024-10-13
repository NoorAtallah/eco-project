"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`http://localhost:3000/api/products`);
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-10 text-xl text-[#a2e08ff3]">Loading...</div>;
  if (error) return <div className="text-center py-10 text-xl text-red-600">Error: {error}</div>;

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {});

  const categories = ['All', ...Object.keys(productsByCategory)];

  // Filter products based on search term and selected category
  const filteredProducts = Object.entries(productsByCategory).reduce((acc, [category, categoryProducts]) => {
    const filtered = categoryProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[category] = filtered;
    }
    return acc;
  }, {});

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? 'All' : category);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-green-900">Product Listing</h1>
        
        <div className="mb-8 relative">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full p-3 pr-10 rounded-md bg-white text-black border border-[#a2e08ff3] focus:outline-none focus:ring-2 focus:ring-[#a2e08ff3]"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#a2e08ff3]" size={20} />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === category
                    ? 'bg-[#a2e08ff3] text-white'
                    : 'bg-green-100 text-green-800'
                } hover:bg-[#a2e08ff3] hover:text-white transition-colors`}
              >
                {category}
                {selectedCategory === category && (
                  <X size={14} className="inline-block ml-1" onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCategory('All');
                  }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {Object.entries(filteredProducts).map(([category, categoryProducts]) => {
          // Only render the category if it's selected or if "All" is selected
          if (selectedCategory === 'All' || selectedCategory === category) {
            return (
              <div key={category} className="mb-12">
                <h2 className="text-3xl font-semibold mb-6 text-[#a2e08ff3] border-b-2 border-[#a2e08ff3] pb-2">{category}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-items-center">
                  {categoryProducts.map((product) => (
                    <Link href={`/products/${product._id}`} key={product._id} className="w-full max-w-sm">
                      <div className="bg-green-50 rounded-lg p-6 shadow-lg cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 h-full flex flex-col justify-between">
                        <div>
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-48 object-contain rounded-md mb-4"
                          />
                          <h3 className="text-xl font-semibold text-black mb-2">{product.name}</h3>
                          <p className="text-black opacity-80 mb-3 flex-grow">{product.description}</p>
                        </div>
                        <div className="mt-auto">
                          <div className="flex justify-between items-center">
                            <p className="text-lg font-bold text-black">${product.price}</p>
                            <p className="text-sm text-black opacity-70">Stock: {product.stock}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}