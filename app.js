// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCnq_JaQ8CdQ90VKLofaQloU-oqkIpp5SY",
  authDomain: "eclearnix-leave-system.firebaseapp.com",
  databaseURL: "https://eclearnix-leave-system-default-rtdb.firebaseio.com",
  projectId: "eclearnix-leave-system",
  storageBucket: "eclearnix-leave-system.appspot.com",
  messagingSenderId: "900803067176",
  appId: "1:900803067176:web:9f96df38c76414506c241d"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* ======================================================
   EMPLOYEE PAGE LOGIC
====================================================== */

const form = document.getElementById("leaveForm");
const employeeTable = document.getElementById("requests");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const leaveData = {
      name: document.getElementById("name").value,
      reason: document.getElementById("reason").value,
      from: document.getElementById("from").value,
      to: document.getElementById("to").value,
      status: "Pending",
      actionTime: "Not reviewed yet"
    };

    db.ref("leaves").push(leaveData);
    alert("Leave Request Submitted Successfully!");
    form.reset();
  });

  // Employee real-time view
  db.ref("leaves").on("value", (snapshot) => {
    employeeTable.innerHTML = "";
    snapshot.forEach((child) => {
      const data = child.val();

      employeeTable.innerHTML += `
        <tr>
          <td>${data.name}</td>
          <td>${data.from}</td>
          <td>${data.to}</td>
          <td class="status-${data.status}">${data.status}</td>
          <td>${data.actionTime || "Not reviewed yet"}</td>
        </tr>
      `;
    });
  });
}


/* ======================================================
   MANAGER PAGE LOGIC
====================================================== */

const adminTable = document.getElementById("allRequests");

if (adminTable) {
  db.ref("leaves").on("value", (snapshot) => {
    adminTable.innerHTML = "";
    snapshot.forEach((child) => {
      const data = child.val();
      const id = child.key;

      adminTable.innerHTML += `
        <tr>
          <td>${data.name}</td>
          <td>${data.reason}</td>
          <td>${data.from}</td>
          <td>${data.to}</td>
          <td class="status-${data.status}">${data.status}</td>
          <td>${data.actionTime || "-"}</td>
          <td>
            <button onclick="updateStatus('${id}','Approved')">Approve</button>
            <button onclick="updateStatus('${id}','Rejected')">Reject</button>
          </td>
        </tr>
      `;
    });
  });
}


// Update leave status + timestamp
function updateStatus(id, status) {
  const now = new Date();
  const formattedTime = now.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });

  db.ref("leaves/" + id).update({ 
    status: status,
    actionTime: formattedTime
  });
}
