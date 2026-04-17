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
  status: "pending" | "completed" | "overdue" | "denied";
  deadline: string;
  dateChallenged: string;
  challengedBy: string;
  challengedById?: string;
  nomineeEmail?: string;
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
  type: "pledge" | "donation" | "nomination" | "denied";
  date: string;
}

interface AppContextType {
  pledges: Pledge[];
  donations: Donation[];
  activities: Activity[];
  addDonation: (donation: Omit<Donation, "id" | "date">) => Promise<void>;
  addPledge: (pledge: Omit<Pledge, "id" | "status" | "deadline" | "dateChallenged">) => Promise<string>;
  updatePledgeStatus: (pledgeId: string, status: Pledge["status"]) => Promise<void>;
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
      const donationData: any = {
        ...newDonation,
        date: new Date().toLocaleString(), // Store as string for now to match interface, or use Timestamp
        timestamp: serverTimestamp(),
      };
      
      // Firestore does not accept "undefined" values, so we delete it if it exists
      if (donationData.pledgeId === undefined) {
        delete donationData.pledgeId;
      }
      
      await addDoc(collection(db, "donations"), donationData);

      // If this donation is attached to a pledge, mark the pledge as completed
      if (newDonation.pledgeId) {
        const { doc, updateDoc } = await import("firebase/firestore");
        const pledgeRef = doc(db, "pledges", newDonation.pledgeId);
        await updateDoc(pledgeRef, { status: "completed" });
      } else {
        // Only trigger generic activity feed if it wasn't a pledge fulfillment
        await addDoc(collection(db, "activities"), {
          message: `${newDonation.donorName} contributed R${newDonation.amount.toLocaleString()}`,
          type: "donation",
          date: "Just now",
          timestamp: serverTimestamp(),
        });
      }

      if (newDonation.pledgeId) {
         await addDoc(collection(db, "activities"), {
          message: `Challenge Accepted! ${newDonation.donorName} fulfilled their nomination.`,
          type: "pledge",
          date: "Just now",
          timestamp: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error adding donation:", error);
      throw error;
    }
  };

  const addPledge = async (newPledge: Omit<Pledge, "id" | "status" | "deadline" | "dateChallenged">) => {
    try {
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + 7);

      const pledgeData = {
        ...newPledge,
        status: "pending",
        dateChallenged: new Date().toISOString().split('T')[0],
        deadline: deadlineDate.toISOString().split('T')[0],
        timestamp: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, "pledges"), pledgeData);

      // Add to activity feed
      await addDoc(collection(db, "activities"), {
        message: `New Nomination: ${newPledge.fullName} was challenged!`,
        type: "nomination",
        date: "Just now",
        timestamp: serverTimestamp(),
      });

      return docRef.id;
    } catch (error) {
      console.error("Error adding pledge:", error);
      throw error;
    }
  };

  const updatePledgeStatus = async (pledgeId: string, status: Pledge["status"]) => {
    try {
      // In a real app we update the doc, but here we run into the firestore `updateDoc` needing an import.
      // Let's use `addDoc` but wait, we need to update the existing document.
      const { doc, updateDoc } = await import("firebase/firestore");
      const pledgeRef = doc(db, "pledges", pledgeId);
      await updateDoc(pledgeRef, { status });

      if (status === "denied") {
        await addDoc(collection(db, "activities"), {
          message: `A pledge challenge was unaccepted.`,
          type: "denied",
          date: "Just now",
          timestamp: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error updating pledge status:", error);
      throw error;
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
      updatePledgeStatus,
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
