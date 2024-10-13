'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import Swal from 'sweetalert2';

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [exchangeRequest, setExchangeRequest] = useState({
    userBook: '',
    school: '',
    date: '',
    time: '',
  });
  const router = useRouter();

  const schools = ['Fatima bnt Al-khatab', 'Alramlah School', 'Aisha bnt Abi Bakr', 'Al-mohalab']; // Add your list of schools here

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books', {
          credentials: 'include',
        });

        if (response.status === 401) {
          router.push('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBooks(data);
      } catch (e) {
        console.error('Failed to fetch books:', e);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [router]);

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCondition = filterCondition === 'all' || book.condition === filterCondition;
    return matchesSearch && matchesCondition;
  });

  const handleExchange = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBook(null);
    setExchangeRequest({
      userBook: '',
      school: '',
      date: '',
      time: '',
    });
  };

  const handleExchangeSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/exchange', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          bookId: selectedBook._id,
          userBook: exchangeRequest.userBook,
          school: exchangeRequest.school,
          date: exchangeRequest.date,
          time: exchangeRequest.time,
        }),
      });
  
      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: 'Exchange request submitted successfully',
          icon: 'success',
          confirmButtonText: 'OK'
        });
        handleCloseModal();
      } else {
        const errorData = await response.json();
        console.error('Error submitting exchange request:', errorData.message);
        alert('Failed to submit exchange request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting exchange request:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#a2e08ff3]">Available Books for Exchange</h1>
      
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
        <div className="relative w-full md:w-1/3 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a2e08ff3]"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <select
          value={filterCondition}
          onChange={(e) => setFilterCondition(e.target.value)}
          className="w-full md:w-auto px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a2e08ff3]"
        >
          <option value="all">All Conditions</option>
          <option value="new">New</option>
          <option value="used">Used</option>
        </select>
      </div>

      {filteredBooks.length === 0 ? (
        <p className="text-center text-xl text-[#a2e08ff3]">No books available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
          {filteredBooks.map((book) => (
            <div key={book._id} className="bg-white rounded-lg shadow-md overflow-hidden ">
              <img src={book.imageUrl} alt={book.title} className="w-full h-48 object-contain" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-black">{book.title}</h2>
                <p className="text-black mb-1">Owner: {book.author}</p>
                <p className="text-black mb-1">Condition: {book.condition}</p>
                <p className="text-black mb-2">Location: {book.location}</p>
                <button
                  onClick={() => handleExchange(book)}
                  className="w-full bg-green-50 text-[#a2e08ff3] py-2 px-4 rounded hover:bg-[#588b49f3] hover:text-white transition duration-300"
                >
                  Exchange
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#a2e08ff3]">Exchange Request</h2>
              <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleExchangeSubmit}>
              <div className="mb-4">
                <label className="block text-[#a2e08ff3] text-sm font-bold mb-2" htmlFor="userBook">
                  Your Book Title
                </label>
                <input
                  type="text"
                  id="userBook"
                  value={exchangeRequest.userBook}
                  onChange={(e) => setExchangeRequest({...exchangeRequest, userBook: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a2e08ff3]"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-[#a2e08ff3] text-sm font-bold mb-2" htmlFor="school">
                  School
                </label>
                <select
                  id="school"
                  value={exchangeRequest.school}
                  onChange={(e) => setExchangeRequest({...exchangeRequest, school: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a2e08ff3]"
                  required
                >
                  <option value="">Select a school</option>
                  {schools.map((school, index) => (
                    <option key={index} value={school}>{school}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-[#a2e08ff3] text-sm font-bold mb-2" htmlFor="date">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={exchangeRequest.date}
                  onChange={(e) => setExchangeRequest({...exchangeRequest, date: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a2e08ff3]"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-[#a2e08ff3] text-sm font-bold mb-2" htmlFor="time">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  value={exchangeRequest.time}
                  onChange={(e) => setExchangeRequest({...exchangeRequest, time: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a2e08ff3]"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#a2e08ff3] text-white py-2 px-4 rounded hover:bg-[#588b49f3] transition duration-300"
              >
                Submit Exchange Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksPage;