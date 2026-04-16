import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";
import Navbar from "../components/Navbar";

// Configuration for image base URL
const IMAGE_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function TrekDetails() {
   const { id } = useParams();
   const navigate = useNavigate();

   const [trek, setTrek] = useState(null);
   const [schedules, setSchedules] = useState([]);
   const [rides, setRides] = useState([]);
   const [reviews, setReviews] = useState([]);
   const [newComment, setNewComment] = useState("");
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [myBookings, setMyBookings] = useState([]);

   // Booking modal state
   const [showBookingModal, setShowBookingModal] = useState(false);
   const [selectedRide, setSelectedRide] = useState(null);
   const [selectedSeats, setSelectedSeats] = useState([]);

   // Trek booking state
   const [showTrekModal, setShowTrekModal] = useState(false);
   const [selectedSchedule, setSelectedSchedule] = useState(null);
   const [trekSeats, setTrekSeats] = useState(1);

   const totalSeats = selectedRide?.total_seats || 12;
   const bookedSeats = selectedRide?.booked_seats || [];

   const fetchDetails = async () => {
      setLoading(true);
      setError(null);
      try {
         // 1. Trek Details (Supports Slug or ID)
         const trekRes = await API.get(`/api/treks/${id}`);
         const realTrek = trekRes.data;
         setTrek(realTrek);

         // IMPORTANT: Use the REAL database _id for subsequent queries
         const trekDbId = realTrek._id;

         // 2. Guide Schedules (Real-time Filter)
         const scheduleRes = await API.get("/api/schedules");
         const matchedSchedules = scheduleRes.data.filter(s =>
            (s.trek_id?._id || s.trek_id) === trekDbId
         );
         setSchedules(matchedSchedules);

         // 3. Vendor Rides (Using our new API filter)
         const rideRes = await API.get(`/api/rides?trek_id=${trekDbId}`);
         setRides(rideRes.data);

         // 4. Trek Reviews
         const reviewRes = await API.get(`/api/reviews/trek/${trekDbId}`);
         setReviews(reviewRes.data);

         // 5. User's existing bookings (to prevent duplicates)
         const token = localStorage.getItem("token");
         if (token) {
           const bookingRes = await API.get("/api/bookings/my");
           setMyBookings(bookingRes.data);
         }

      } catch (error) {
         console.error("Failed to load trek details", error);
         setError("Failed to load trek details. Please try again later.");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchDetails();
   }, [id]);

   const openBookingModal = (ride) => {
      const token = localStorage.getItem("token");
      if (!token) {
         alert("Please login to book a ride.");
         navigate("/login");
         return;
      }
      setSelectedRide(ride);
      setSelectedSeats([]);
      setShowBookingModal(true);
   };

   const handleBookRide = async () => {
      if (!selectedRide) return;

      if (selectedSeats.length === 0) {
         alert(`Please select at least one seat.`);
         return;
      }

      try {
         await API.post(`/api/bookings/ride/${selectedRide._id}`, { 
            seats: selectedSeats.length,
            seat_numbers: selectedSeats
         });
         
         setShowBookingModal(false);
         alert("Ride booking request sent! Please wait for the vendor to review and confirm your booking.");
         navigate("/trekker/bookings");
      } catch (error) {
         console.error("Booking failed:", error);
         alert(error.response?.data?.message || "Booking failed. Please try again.");
      }
   };

   const handleJoinExpedition = (sch) => {
      const token = localStorage.getItem("token");
      if (!token) {
         alert("Please login to join an expedition.");
         navigate("/login");
         return;
      }
      setSelectedSchedule(sch);
      setTrekSeats(1);
      setShowTrekModal(true);
   };

   const handleConfirmTrekBooking = async () => {
      if (!selectedSchedule) return;

      try {
         await API.post("/api/bookings", {
            trek_schedule_id: selectedSchedule._id,
            seats: trekSeats
         });
         
         setShowTrekModal(false);
         alert("Trek booking request sent! Please wait for the guide to review and confirm your booking.");
         navigate("/trekker/bookings");
      } catch (error) {
         console.error("Join failed:", error);
         alert(error.response?.data?.message || "Join failed. Please try again.");
      }
   };

   const handleAddReview = async (e) => {
      e.preventDefault();
      if (!newComment.trim()) {
         alert("Please write a comment before submitting.");
         return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
         alert("Please login to leave a review.");
         navigate("/login");
         return;
      }

      try {
         await API.post("/api/reviews", {
            trek_id: trek._id,
            comment: newComment,
            rating: 5 // Default rating to keep it simple as requested
         });
         setNewComment("");
         fetchDetails(); // Refresh list
         alert("Thank you for your feedback!");
      } catch (error) {
         alert(error.response?.data?.message || "Failed to post review. Please try again.");
      }
   };

   const handleDeleteReview = async (reviewId) => {
      try {
         await API.delete(`/api/reviews/${reviewId}`);
         fetchDetails();
      } catch (error) {
         alert(error.response?.data?.message || "Failed to delete review. Please try again.");
      }
   };

   if (loading) return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C] text-[#AAFF00] font-black uppercase tracking-widest animate-pulse">
         Syncing Adventure Details...
      </div>
   );

   if (error) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0F1C] text-white">
         <h1 className="text-6xl font-black text-[#EF4444] mb-4">⚠️</h1>
         <p className="text-gray-400 mb-8">{error}</p>
         <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-[#AAFF00] text-black font-black uppercase text-xs rounded-xl hover:bg-white transition-all"
         >
            Retry
         </button>
      </div>
   );

   if (!trek) return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0F1C] text-white">
         <h1 className="text-6xl font-black text-[#EF4444] mb-4">404</h1>
         <p className="text-gray-400 mb-8">Trek not discovered in our database.</p>
         <button onClick={() => navigate("/")} className="px-8 py-3 bg-[#AAFF00] text-black font-black uppercase text-xs rounded-xl">Back to Basecamp</button>
      </div>
   );

   return (
      <div className="min-h-screen bg-[#0A0F1C] text-white font-sans selection:bg-[#AAFF00] selection:text-black">
         <Navbar />
         {showBookingModal && selectedRide && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-[#1A2235] rounded-2xl border border-gray-800 max-w-lg w-full p-7 shadow-2xl">
                  <h3 className="text-2xl font-black text-white mb-5">Book Transport</h3>
                  <div className="bg-[#0A0F1C] p-5 rounded-2xl mb-6 border border-gray-800 shadow-inner">
                     <p className="text-sm font-bold text-white mb-1">{selectedRide.ride_name}</p>
                     <p className="text-xs text-gray-500">{selectedRide.pickup_location} → {selectedRide.drop_location}</p>
                     <div className="flex flex-wrap items-center gap-3 mt-4">
                        <span className="text-sm font-black text-[#AAFF00]">Rs. {selectedRide.price}</span>
                        <span className="text-xs text-gray-400">• {selectedRide.available_seats} seats available</span>
                     </div>
                  </div>

                  <div className="mb-6">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Seats</p>
                     <div className="grid grid-cols-4 gap-3">
                        {[...Array(totalSeats)].map((_, index) => {
                           const seatNumber = index + 1;
                           const isBooked = bookedSeats.includes(seatNumber);
                           const isSelected = selectedSeats.includes(seatNumber);

                           return (
                              <button
                                 key={seatNumber}
                                 disabled={isBooked}
                                 onClick={() => {
                                    if (isSelected) {
                                       setSelectedSeats(selectedSeats.filter(s => s !== seatNumber));
                                    } else {
                                       setSelectedSeats([...selectedSeats, seatNumber]);
                                    }
                                 }}
                                 className="h-12 rounded-xl text-sm font-black transition-all"
                                 style={{
                                    backgroundColor: isBooked
                                       ? "#EF4444"
                                       : isSelected
                                       ? "#AAFF00"
                                       : "#1A2235",
                                    color: isBooked ? "#FFFFFF" : isSelected ? "#000" : "#D1D5DB",
                                    cursor: isBooked ? "not-allowed" : "pointer",
                                    border: isBooked ? "1px solid #7F1D1D" : "1px solid #374151"
                                 }}
                              >
                                 {seatNumber}
                              </button>
                           );
                        })}
                     </div>

                     <p className="text-sm mt-3 text-[#AAFF00] font-bold">Selected Seats: {selectedSeats.length}</p>
                  </div>

                  <div className="bg-[#111827] p-5 rounded-2xl mb-6 border border-gray-800">
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">Total Amount</span>
                        <span className="text-2xl font-black text-[#AAFF00]">Rs. {(selectedRide.price * selectedSeats.length).toLocaleString()}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <button
                        onClick={() => setShowBookingModal(false)}
                        className="py-3 rounded-2xl font-bold text-sm border border-gray-800 text-gray-400 hover:bg-gray-800 transition-all"
                     >
                        Cancel
                     </button>
                     <button
                        onClick={handleBookRide}
                        className="py-3 rounded-2xl font-bold text-sm bg-[#AAFF00] text-black hover:bg-white transition-all"
                     >
                        Confirm Booking
                     </button>
                  </div>
               </div>
            </div>
         )}
         {/* TREK BOOKING MODAL */}
         {showTrekModal && selectedSchedule && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-[#1A2235] rounded-2xl border border-gray-800 max-w-md w-full p-7 shadow-2xl">
                  <h3 className="text-2xl font-black text-white mb-5">Join Expedition</h3>
                  
                  <div className="bg-[#0A0F1C] p-5 rounded-2xl mb-6 border border-gray-800">
                     <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Departure Date</p>
                     <p className="text-lg font-black text-white">{new Date(selectedSchedule.start_date).toLocaleDateString()}</p>
                     <p className="text-xs text-[#AAFF00] mt-4 font-bold uppercase">{selectedSchedule.available_seats} Seats Available</p>
                  </div>

                  <div className="mb-6">
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Number of Trekkers</p>
                     <div className="flex items-center gap-4 bg-[#0A0F1C] p-2 rounded-xl border border-gray-800">
                        <button 
                           onClick={() => setTrekSeats(Math.max(1, trekSeats - 1))}
                           className="w-10 h-10 rounded-lg bg-gray-800 text-white font-bold hover:bg-gray-700 transition-all"
                        >
                           -
                        </button>
                        <span className="flex-1 text-center font-black text-xl text-white">{trekSeats}</span>
                        <button 
                           onClick={() => setTrekSeats(Math.min(selectedSchedule.available_seats, trekSeats + 1))}
                           className="w-10 h-10 rounded-lg bg-[#AAFF00] text-black font-bold hover:bg-white transition-all"
                        >
                           +
                        </button>
                     </div>
                  </div>

                  <div className="bg-[#111827] p-5 rounded-2xl mb-6 border border-gray-800">
                     <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                        <span>Per Person</span>
                        <span className="text-white">Rs. {trek.cost.toLocaleString()}</span>
                     </div>
                     <div className="flex justify-between items-center border-t border-gray-800 pt-3">
                        <span className="text-sm text-gray-400 font-bold">Total Investment</span>
                        <span className="text-2xl font-black text-[#AAFF00]">Rs. {(trek.cost * trekSeats).toLocaleString()}</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                     <button
                        onClick={() => setShowTrekModal(false)}
                        className="py-3 rounded-2xl font-bold text-sm border border-gray-800 text-gray-400 hover:bg-gray-800 transition-all font-black uppercase"
                     >
                        Abort
                     </button>
                     <button
                        onClick={handleConfirmTrekBooking}
                        className="py-3 rounded-2xl font-bold text-sm bg-[#AAFF00] text-black hover:bg-white transition-all font-black uppercase"
                     >
                        Confirm Booking
                     </button>
                  </div>
               </div>
            </div>
         )}

         {/* HERO SECTION */}
         <div className="relative h-[40vh] overflow-hidden border-b border-gray-800">
            <img
               src={trek.image_url ? `${IMAGE_BASE_URL}${trek.image_url}` : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000"}
               alt={trek.trek_name}
               className="w-full h-full object-cover opacity-60"
               onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000";
               }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] to-transparent"></div>
            <div className="absolute bottom-10 left-6 max-w-7xl mx-auto w-full px-6">
               <p className="text-[#AAFF00] font-black tracking-widest uppercase text-xs mb-2">Adventure Blueprint</p>
               <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">{trek.trek_name}</h1>
               <div className="flex gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                     <p className="text-[0.6rem] text-gray-400 font-bold uppercase">Difficulty</p>
                     <p className="text-sm font-black text-[#AAFF00]">{trek.difficulty_level}</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                     <p className="text-[0.6rem] text-gray-400 font-bold uppercase">Duration</p>
                     <p className="text-sm font-black">{trek.duration_days} Days</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                     <p className="text-[0.6rem] text-gray-400 font-bold uppercase">Base Price</p>
                     <p className="text-sm font-black">Rs. {trek.cost.toLocaleString()}</p>
                  </div>
               </div>
            </div>
         </div>

         <main className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-12">
            {/* LEFT: DESCRIPTION & SCHEDULES */}
            <div className="lg:col-span-7 space-y-12">
               <section>
                  <h2 className="text-lg font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                     <span className="w-8 h-8 rounded-lg bg-[#AAFF00]/10 text-[#AAFF00] flex items-center justify-center text-xs">📜</span>
                     Expedition Brief
                  </h2>
                  <div className="bg-[#1A2235] p-8 rounded-2xl border border-gray-800 leading-relaxed text-gray-300 font-medium">
                     {trek.description || "No specific briefing available for this expedition."}
                  </div>
               </section>

               <section>
                  <h2 className="text-lg font-black text-[#AAFF00] uppercase tracking-widest mb-6 flex items-center gap-3">
                     <span className="w-8 h-8 rounded-lg bg-[#AAFF00]/10 text-[#AAFF00] flex items-center justify-center text-xs italic">📅</span>
                     Official Departures (Guides)
                  </h2>
                  {schedules.length === 0 ? (
                     <div className="bg-gray-900/40 p-8 rounded-2xl border border-dashed border-gray-800 text-center text-gray-500 font-bold uppercase text-xs">
                        No official departures scheduled by guides yet.
                     </div>
                  ) : (
                     <div className="grid gap-6">
                        {schedules.map(sch => (
                           <div key={sch._id} className="bg-[#1A2235] p-6 rounded-2xl border border-gray-800 hover:border-[#AAFF00]/30 transition-all group">
                              <div className="flex justify-between items-start mb-6">
                                 <div>
                                    <p className="text-2xl font-black text-white">{new Date(sch.start_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                                    <p className="text-xs text-gray-500 font-bold uppercase mt-1">Expedition Launch</p>
                                 </div>
                                 <div className="text-right">
                                    <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase ${
                                       sch.available_seats <= 3 ? 'bg-red-500 text-white animate-pulse' :
                                       sch.available_seats <= 6 ? 'bg-orange-500 text-white' :
                                       'bg-[#AAFF00] text-black'
                                    }`}>
                                       {sch.available_seats} Seats Open
                                    </span>
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800/50">
                                 <div>
                                    <p className="text-[0.6rem] text-gray-500 font-black uppercase tracking-widest">Assigned Guide</p>
                                    <p className="text-sm font-bold text-white mt-1">{sch.guide_id?.name || "Professional Guide"}</p>
                                 </div>
                                 <div className="text-right">
                                    {myBookings.some(b => b.trek_schedule_id?._id === sch._id && b.booking_status !== 'Cancelled') ? (
                                       <button disabled className="px-6 py-3 bg-gray-800 text-gray-500 font-black uppercase text-[0.65rem] tracking-widest rounded-xl cursor-not-allowed">
                                          Already Joined
                                       </button>
                                    ) : (
                                       <button
                                          onClick={() => handleJoinExpedition(sch)}
                                          className="px-6 py-3 bg-[#AAFF00] text-black font-black uppercase text-[0.65rem] tracking-widest rounded-xl hover:bg-white transition-all transform active:scale-95 shadow-xl shadow-[#AAFF00]/5"
                                       >
                                          Join Expedition
                                       </button>
                                    )}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </section>
            </div>

            {/* RIGHT: RIDE SHARING & GROUPS */}
            <div className="lg:col-span-5 space-y-12">
               <section>
                  <h2 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                     <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs">🚙</span>
                     Vendor Logistics (Transports)
                  </h2>
                  {rides.length === 0 ? (
                     <div className="bg-gray-900/40 p-8 rounded-2xl border border-dashed border-gray-800 text-center text-gray-500 font-bold uppercase text-xs">
                        No official transport slots listed by vendors.
                     </div>
                  ) : (
                     <div className="grid gap-4">
                        {rides.map(ride => (
                           <div key={ride._id} className="bg-[#1A2235] p-5 rounded-2xl border border-gray-800 hover:border-blue-500/30 transition-all flex justify-between items-center group">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl shadow-inner">
                                    🚗
                                 </div>
                                 <div>
                                    <h3 className="text-sm font-black text-white uppercase leading-tight">{ride.ride_name}</h3>
                                    <p className="text-[0.65rem] text-gray-500 font-bold uppercase tracking-tighter mt-0.5">{ride.pickup_location} → {ride.drop_location}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                       <span className="text-[0.6rem] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-black uppercase">Rs. {ride.price}</span>
                                       <span className={`text-[0.6rem] px-2 py-1 rounded font-black uppercase ${
                                          ride.available_seats <= 2 ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/20' :
                                          ride.available_seats <= 4 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/10' :
                                          'bg-blue-500/10 text-blue-400'
                                        }`}>
                                          {ride.available_seats} Seats Left
                                        </span>
                                    </div>
                                 </div>
                              </div>
                              {myBookings.some(b => b.ride_id?._id === ride._id && b.booking_status !== 'Cancelled') ? (
                                 <button disabled className="bg-gray-800 text-gray-500 px-4 py-2 rounded-xl text-sm font-bold cursor-not-allowed">
                                    Booked
                                 </button>
                              ) : (
                                 <button
                                    onClick={() => openBookingModal(ride)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                 >
                                    Join Ride
                                 </button>
                              )}
                           </div>
                        ))}
                     </div>
                  )}
               </section>

               <section>
                  <h2 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                     <span className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center text-xs">✍️</span>
                     Trekker Reviews
                  </h2>

                  {/* POST REVIEW BOX (For Logged-in Trekkers) */}
                  <form onSubmit={handleAddReview} className="bg-[#1A2235] p-6 rounded-2xl border border-gray-800 mb-8 border-b-2 border-b-[#AAFF00]/30 shadow-2xl">
                     <p className="text-[0.6rem] text-gray-500 font-black uppercase tracking-widest mb-3">Share your experience</p>
                     <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a short comment..."
                        className="w-full bg-[#0A0F1C] border border-gray-800 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-[#AAFF00] transition-all resize-none min-h-[100px]"
                        maxLength={500}
                     />
                     <div className="flex justify-between items-center mt-2 mb-4">
                        <span className="text-xs text-gray-600">{newComment.length}/500</span>
                     </div>
                     <button
                        type="submit"
                        className="mt-2 w-full py-4 bg-[#AAFF00] text-black font-black uppercase text-[0.65rem] tracking-widest rounded-xl hover:bg-white transition-all transform active:scale-95 shadow-xl shadow-[#AAFF00]/5 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!newComment.trim()}
                     >
                        Post Review
                     </button>
                  </form>

                  {/* REVIEWS LIST */}
                  {reviews.length === 0 ? (
                     <div className="bg-gray-900/20 p-8 rounded-2xl border border-dashed border-gray-800 text-center">
                        <p className="text-xl mb-2 grayscale opacity-40">💬</p>
                        <p className="text-[0.6rem] text-gray-600 font-bold uppercase tracking-widest">No reviews yet. Be the first to shout out!</p>
                     </div>
                  ) : (
                     <div className="grid gap-4">
                        {reviews.map(rev => (
                           <div key={rev._id} className="bg-[#111827] p-5 rounded-2xl border border-gray-800 transition-all hover:bg-[#1A2235]">
                              <div className="flex justify-between items-center mb-3 gap-3">
                                 <div>
                                    <span className="text-[0.65rem] font-black text-[#AAFF00] uppercase tracking-tighter">
                                       {rev.trekker_id?.trekker_name || "Adventurer"}
                                    </span>
                                    <div className="text-[0.6rem] text-gray-600 font-medium mt-1">
                                       {new Date(rev.createdAt).toLocaleDateString()}
                                    </div>
                                 </div>
                                 <button
                                    onClick={() => handleDeleteReview(rev._id)}
                                    className="text-[0.65rem] text-red-400 hover:text-red-200 font-bold uppercase tracking-wider"
                                 >
                                    Delete
                                 </button>
                              </div>
                              <p className="text-sm text-gray-400 italic leading-relaxed">"{rev.comment}"</p>
                           </div>
                        ))}
                     </div>
                  )}
               </section>
            </div>
         </main>
      </div>
   );
}

export default TrekDetails;