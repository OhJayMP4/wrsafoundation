"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Pledge {
  id: string;
  fullName: string;
  organization: string;
  amount: number;
  status: "pending" | "awaiting_payment" | "completed" | "overdue" | "denied";
  deadline: string;
  dateChallenged: string;
  challengedBy: string;
  challengedById?: string;
  nomineeEmail?: string;
  pledgerEmail?: string;
  pledgerPhone?: string;
}

export interface Donation {
  id: string;
  donorName: string;
  amount: number;
  date: string;
  type: "Pledge Pay" | "General";
  method: string;
  pledgeId?: string;
  order?: number;        // custom honour roll position (lower = higher)
  visible?: boolean;     // false = hidden from public honour roll
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
  addPledge: (pledge: Omit<Pledge, "id" | "status" | "deadline" | "dateChallenged">, initialStatus?: Pledge["status"]) => Promise<string>;
  updatePledgeStatus: (pledgeId: string, status: Pledge["status"]) => Promise<void>;
  markAsPaid: (pledgeId: string, amount: number) => Promise<void>;
  deletePledge: (pledgeId: string) => Promise<void>;
  editPledge: (pledgeId: string, updatedData: Partial<Pledge>) => Promise<void>;
  updateDonation: (donationId: string, data: Partial<Donation>) => Promise<void>;
  deleteDonation: (donationId: string) => Promise<void>;
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
    const qPledges = query(collection(db, "pledges"), orderBy("dateChallenged", "desc"));
    const unsubPledges = onSnapshot(qPledges, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Pledge[];
      setPledges(data);
      setLoading(false);
    });

    const qDonations = query(collection(db, "donations"), orderBy("date", "desc"));
    const unsubDonations = onSnapshot(qDonations, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Donation[];
      setDonations(data);
    });

    const qActivities = query(collection(db, "activities"), orderBy("date", "desc"));
    const unsubActivities = onSnapshot(qActivities, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Activity[];
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
        date: new Date().toLocaleString(),
        timestamp: serverTimestamp(),
      };

      if (donationData.pledgeId === undefined) {
        delete donationData.pledgeId;
      }

      await addDoc(collection(db, "donations"), donationData);

      if (newDonation.pledgeId) {
        const { doc, updateDoc } = await import("firebase/firestore");
        const pledgeRef = doc(db, "pledges", newDonation.pledgeId);
        await updateDoc(pledgeRef, { status: "completed" });

        await addDoc(collection(db, "activities"), {
          message: `Challenge Accepted! ${newDonation.donorName} fulfilled their nomination.`,
          type: "pledge",
          date: new Date().toISOString(),
          timestamp: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "activities"), {
          message: `${newDonation.donorName} contributed R${newDonation.amount.toLocaleString()}`,
          type: "donation",
          date: new Date().toISOString(),
          timestamp: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error adding donation:", error);
      throw error;
    }
  };

  const addPledge = async (newPledge: Omit<Pledge, "id" | "status" | "deadline" | "dateChallenged">, initialStatus: Pledge["status"] = "pending") => {
    try {
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + 7);

      const pledgeData: any = {
        ...newPledge,
        status: initialStatus,
        dateChallenged: new Date().toISOString().split("T")[0],
        deadline: deadlineDate.toISOString().split("T")[0],
        timestamp: serverTimestamp(),
      };

      // Remove undefined fields Firestore cannot accept
      Object.keys(pledgeData).forEach((key) => {
        if (pledgeData[key] === undefined) delete pledgeData[key];
      });

      const docRef = await addDoc(collection(db, "pledges"), pledgeData);

      await addDoc(collection(db, "activities"), {
        message: `New Nomination: ${newPledge.fullName} was challenged!`,
        type: "nomination",
        date: new Date().toISOString(),
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
      const { doc, updateDoc } = await import("firebase/firestore");
      const pledgeRef = doc(db, "pledges", pledgeId);
      await updateDoc(pledgeRef, { status });

      if (status === "denied") {
        await addDoc(collection(db, "activities"), {
          message: `A pledge challenge was declined.`,
          type: "denied",
          date: new Date().toISOString(),
          timestamp: serverTimestamp(),
        });
      }

      if (status === "awaiting_payment") {
        await addDoc(collection(db, "activities"), {
          message: `A pledge has been committed — awaiting payment confirmation.`,
          type: "pledge",
          date: new Date().toISOString(),
          timestamp: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error("Error updating pledge status:", error);
      throw error;
    }
  };

  // Called by admin when physical payment has been received
  const markAsPaid = async (pledgeId: string, amount: number) => {
    try {
      const pledge = pledges.find((p) => p.id === pledgeId);
      if (!pledge) throw new Error("Pledge not found");

      // Create the donation record
      const donationData: any = {
        donorName: pledge.fullName,
        amount,
        date: new Date().toLocaleString(),
        type: "Pledge Pay",
        method: "Manual (Admin Confirmed)",
        pledgeId,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "donations"), donationData);

      // Mark pledge as completed
      const { doc, updateDoc } = await import("firebase/firestore");
      const pledgeRef = doc(db, "pledges", pledgeId);
      await updateDoc(pledgeRef, { status: "completed" });

      await addDoc(collection(db, "activities"), {
        message: `Payment confirmed! ${pledge.fullName} is now a Legacy Champion.`,
        type: "donation",
        date: new Date().toISOString(),
        timestamp: serverTimestamp(),
      });

      // Notify pledger by email if we have their email
      const emailTo = pledge.pledgerEmail || pledge.nomineeEmail;
      if (emailTo) {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "pledge_paid",
            pledgerName: pledge.fullName,
            pledgerEmail: emailTo,
            amount,
          }),
        });
      }
    } catch (error) {
      console.error("Error marking pledge as paid:", error);
      throw error;
    }
  };

  const deletePledge = async (pledgeId: string) => {
    try {
      const { doc, deleteDoc } = await import("firebase/firestore");
      const pledgeRef = doc(db, "pledges", pledgeId);
      await deleteDoc(pledgeRef);
    } catch (error) {
      console.error("Error deleting pledge:", error);
      throw error;
    }
  };

  const editPledge = async (pledgeId: string, updatedData: Partial<Pledge>) => {
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const pledgeRef = doc(db, "pledges", pledgeId);
      await updateDoc(pledgeRef, updatedData);
    } catch (error) {
      console.error("Error editing pledge:", error);
      throw error;
    }
  };

  const updateDonation = async (donationId: string, data: Partial<Donation>) => {
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      await updateDoc(doc(db, "donations", donationId), data as any);
    } catch (error) {
      console.error("Error updating donation:", error);
      throw error;
    }
  };

  const deleteDonation = async (donationId: string) => {
    try {
      const { doc, deleteDoc } = await import("firebase/firestore");
      await deleteDoc(doc(db, "donations", donationId));
    } catch (error) {
      console.error("Error deleting donation:", error);
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
      markAsPaid,
      deletePledge,
      editPledge,
      updateDonation,
      deleteDonation,
      totalRaised,
      loading,
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
