"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Pledge {
  id: string;
  fullName: string;
  organization: string;
  amount: number;
  status: "pending" | "completed" | "overdue";
  deadline: string;
  dateChallenged: string;
  challengedBy: string;
}

export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  type: "Pledge Pay" | "General";
  method: string;
  pledgeId?: string;
}

export interface Activity {
  id: string;
  message: string;
  type: "pledge" | "donation" | "nomination";
  date: string;
}

interface AppContextType {
  pledges: Pledge[];
  donations: Donation[];
  activities: Activity[];
  addDonation: (donation: Omit<Donation, "id" | "date">) => Promise<void>;
  addPledge: (pledge: Omit<Pledge, "id" | "status" | "deadline" | "dateChallenged" | "challengedBy">) => Promise<void>;
  totalRaised: number;
  loading: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen for Pledges
    const qPledges = query(collection(db, "pledges"), orderBy("dateChallenged", "desc"));
    const unsubPledges = onSnapshot(qPledges, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Pledge[];
      setPledges(data);
      setLoading(false);
    });

    // 2. Listen for Donations
    const qDonations = query(collection(db, "donations"), orderBy("date", "desc"));
    const unsubDonations = onSnapshot(qDonations, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Donation[];
      setDonations(data);
    });

    // 3. Listen for Activities
    const qActivities = query(collection(db, "activities"), orderBy("date", "desc"));
    const unsubActivities = onSnapshot(qActivities, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Activity[];
      setActivities(data);
    });

    return () => {
      unsubPledges();
      unsubDonations();
      unsubActivities();
    };
  }, []);

  const addDonation = async (newDonation: Omit<Donation, "id" | "date">) => {
    try {
      const donationData = {
        ...newDonation,
        date: new Date().toLocaleString(), // Store as string for now to match interface, or use Timestamp
        timestamp: serverTimestamp(),
      };
      
      await addDoc(collection(db, "donations"), donationData);
      
      // Add to activity feed
      await addDoc(collection(db, "activities"), {
        message: `${newDonation.donorName} contributed R${newDonation.amount.toLocaleString()}`,
        type: "donation",
        date: "Just now",
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding donation:", error);
    }
  };

  const addPledge = async (newPledge: Omit<Pledge, "id" | "status" | "deadline" | "dateChallenged" | "challengedBy">) => {
    try {
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + 7);

      const pledgeData = {
        ...newPledge,
        status: "pending",
        dateChallenged: new Date().toISOString().split('T')[0],
        deadline: deadlineDate.toISOString().split('T')[0],
        challengedBy: "Admin", // Default for now
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "pledges"), pledgeData);

      // Add to activity feed
      await addDoc(collection(db, "activities"), {
        message: `New Pledge: ${newPledge.fullName} was nominated!`,
        type: "nomination",
        date: "Just now",
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error adding pledge:", error);
    }
  };

  const totalRaised = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <AppContext.Provider value={{ 
      pledges, 
      donations, 
      activities, 
      addDonation, 
      addPledge, 
      totalRaised,
      loading 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
