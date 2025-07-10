"use client";
import React from 'react'
import { z } from "zod";
import { useAuth } from '../../../../context/auth';
import { useRouter } from 'next/navigation';
import ItineraryForm from '@/components/itinerary-form';

export default function NewItineraryForm() {
      const auth = useAuth();
      const router = useRouter();
      
      const handleSubmit = () => {
        
      }
  return (
    <div><ItineraryForm handleSubmit={handleSubmit} submitButtonLabel="Share Itinerary"/></div>
  )
}
