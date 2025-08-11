
'use client';

import { useState } from 'react';

interface WorkoutPostProps {
  author: string;
  time: string;
  workoutTitle: string;
  warmup: string[];
  mainWorkout: {
    title: string;
    description: string;
    exercises: string[];
  };
  avatar: string;
  level: string;
}

export default function WorkoutPost({ 
  author, 
  time, 
  workoutTitle, 
  warmup, 
  mainWorkout, 
  avatar,
  level
}: WorkoutPostProps) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Iniciante': return 'bg-green-100 text-green-700';
      case 'Intermediário': return 'bg-yellow-100 text-yellow-700';
      case 'Avançado': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6 mb-4 lg:mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-base lg:text-lg">{avatar}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm lg:text-base">{author}</h3>
            <p className="text-xs lg:text-sm text-gray-500">{time}</p>
          </div>
        </div>
        <span className={`px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-medium ${getLevelColor(level)}`}>
          {level}
        </span>
      </div>

      <div className="mb-4 lg:mb-6">
        <h2 className="text-lg lg:text-xl font-bold text-gray-900 mb-3 lg:mb-4">{workoutTitle}</h2>
        
        <div className="mb-4 lg:mb-6">
          <h4 className="text-purple-600 font-semibold mb-2 lg:mb-3 flex items-center gap-2 text-sm lg:text-base">
            <i className="ri-fire-line"></i>
            AQUECIMENTO (6 minutos):
          </h4>
          <div className="space-y-1 lg:space-y-2">
            {warmup.map((exercise, index) => (
              <p key={index} className="text-gray-700 flex items-start gap-2 text-sm lg:text-base">
                <span className="text-purple-400 mt-1">•</span>
                {exercise}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-purple-600 font-semibold mb-2 flex items-center gap-2 text-sm lg:text-base">
            <i className="ri-heart-pulse-line"></i>
            {mainWorkout.title}
          </h4>
          <p className="text-purple-500 font-medium mb-3 bg-purple-50 p-3 rounded-lg text-sm lg:text-base">
            {mainWorkout.description}
          </p>
          <div className="space-y-1 lg:space-y-2">
            {mainWorkout.exercises.map((exercise, index) => (
              <p key={index} className="text-gray-700 flex items-start gap-2 text-sm lg:text-base">
                <span className="text-purple-400 mt-1">•</span>
                {exercise}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-100 gap-4">
        <div className="flex items-center gap-4 lg:gap-6">
          <button 
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-2 cursor-pointer whitespace-nowrap transition-colors ${
              liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            <i className={`${liked ? 'ri-heart-fill' : 'ri-heart-line'} text-lg lg:text-xl`}></i>
            <span className="font-medium text-sm lg:text-base">{liked ? '24' : '23'}</span>
          </button>
          
          <button 
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-gray-500 hover:text-purple-500 cursor-pointer whitespace-nowrap transition-colors"
          >
            <i className="ri-chat-3-line text-lg lg:text-xl"></i>
            <span className="font-medium text-sm lg:text-base">12</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-500 hover:text-green-500 cursor-pointer whitespace-nowrap transition-colors">
            <i className="ri-share-line text-lg lg:text-xl"></i>
            <span className="font-medium text-sm lg:text-base hidden sm:inline">Compartilhar</span>
          </button>
        </div>
        
        {/* Botão "Tentar Este WOD" removido */}
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs lg:text-sm font-bold">M</span>
              </div>
              <div className="flex-1">
                <p className="text-sm"><span className="font-semibold">Mike Johnson</span> Ótimo treino! Acabei de fazer 💪</p>
                <p className="text-xs text-gray-500 mt-1">2 horas atrás</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs lg:text-sm font-bold">S</span>
              </div>
              <div className="flex-1">
                <p className="text-sm"><span className="font-semibold">Sarah Wilson</span> Adorei o foco no cardio!</p>
                <p className="text-xs text-gray-500 mt-1">3 horas atrás</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-4">
            <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs lg:text-sm font-bold">D</span>
            </div>
            <input 
              type="text" 
              placeholder="Escreva um comentário..." 
              className="flex-1 px-3 lg:px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-gray-50"
            />
            <button className="text-purple-500 hover:text-purple-600 cursor-pointer p-2 hover:bg-purple-50 rounded-full transition-colors">
              <i className="ri-send-plane-line text-lg lg:text-xl"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
