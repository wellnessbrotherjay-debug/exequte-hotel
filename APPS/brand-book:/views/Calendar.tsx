
import React from 'react';
import { useAppStore } from '../store';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';

export const CalendarView: React.FC = () => {
  const { contentPosts, activeBrandId } = useAppStore();
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const activePosts = contentPosts.filter(p => p.brand_id === activeBrandId);

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Content Calendar</h1>
        <span className="text-lg opacity-60 font-medium">{format(today, 'MMMM yyyy')}</span>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-black/5 flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-7 bg-black/5 border-b border-black/5">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold opacity-50 uppercase tracking-wide">
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {days.map((day, dayIdx) => {
            const postsForDay = activePosts.filter(post => isSameDay(parseISO(post.scheduled_for), day));
            
            return (
              <div 
                key={day.toString()}
                className={`min-h-[120px] border-b border-r border-black/5 p-2 transition-colors hover:bg-black/5 ${
                  !isSameMonth(day, today) ? 'bg-black/5' : ''
                }`}
              >
                <div className="text-right mb-2">
                  <span className={`text-sm font-medium ${isSameDay(day, today) ? 'bg-black text-white px-2 py-1 rounded-full' : 'opacity-70'}`}>
                    {format(day, 'd')}
                  </span>
                </div>
                
                <div className="space-y-1">
                  {postsForDay.map(post => (
                    <div key={post.id} className="bg-white border border-black/5 text-xs px-2 py-1 rounded font-medium truncate shadow-sm cursor-pointer hover:shadow-md transition-shadow opacity-80">
                      {post.platform}: {post.caption.substring(0, 15)}...
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
