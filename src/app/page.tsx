'use client'
import { createStudent, getStudents } from "@/api/dal/students";
import { useEffect, useState } from "react";

export default function Home() {
  const handleCreateStudent = async () => {
    try {
      // Example student data - modify according to your needs
      const studentData = {
        name: "Test Student",
      };
      
      const newStudent = await createStudent(studentData);
      console.log('Created student:', newStudent);
    } catch (error) {
      console.error('Failed to create student:', error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <button
        onClick={handleCreateStudent}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Create Student
      </button>
    </main>
  );
}
