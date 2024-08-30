import { useQuery, useMutation } from "@tanstack/react-query";

const uri = "https://edugemini.onrender.com";

async function register(formData) {
  return await fetch("https://edugemini.onrender.com/api/eduGemini/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

async function login(formData) {
  return await fetch(`https://edugemini.onrender.com/api/eduGemini/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    body: JSON.stringify(formData),
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

async function logout() {
  return await fetch(`${uri}/api/eduGemini/logout`, {
    method: "POST",
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

async function updateUser(formData) {
  return await fetch(`https://edugemini.onrender.com/api/eduGemini/profile`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();
    console.log(response);
    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

async function getUser() {
  return await fetch(`https://edugemini.onrender.com/api/eduGemini/profile`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function getAllClassroom(userId) {
  return await fetch(`${uri}/api/eduGemini/classroom/allClass/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

async function createClass(formData) {
  return await fetch(`${uri}/api/eduGemini/classroom/createClass`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

async function allClass(userId) {
  await fetch(`${uri}/api/eduGemini/classroom/getAllClass/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response.message || "An Error Occurred");
    }
    return response;
  });
}

export async function fetchAllClassData(userId) {
  return await fetch(`${uri}/api/eduGemini/classroom/getAllClass/${userId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response.message || "An Error Occurred");
    }
    return response;
  });
}

export async function fetchClassData(roomId) {
  return await fetch(
    `${uri}/api/eduGemini/classroom/getCreatedClassroom/${roomId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: "include",
    }
  ).then(async (res) => {
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response.message || "An Error Occurred");
    }
    return response;
  });
}

export async function createAnnouncement(formData, roomId) {
  return await fetch(
    `${uri}/api/eduGemini/classroom/createAnnouncement/${roomId}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      withCredentials: true,
      credentials: "include",
    }
  ).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function getAnnouncement(roomId) {
  return await fetch(
    `${uri}/api/eduGemini/classroom/getAnnouncement/${roomId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      withCredentials: true,
      credentials: "include",
    }
  ).then(async (res) => {
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response.message || "An Error Occurred");
    }
    return response;
  });
}

export async function deleteAnnouncement(announceId, roomId) {
  try {
    const res = await fetch(
      `${uri}/api/eduGemini/classroom/deleteAnnouncement/${roomId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ announceId }),
        withCredentials: true,
        credentials: "include",
      }
    );

    const response = await res.json();
    if (!res.ok) {
      throw new Error(response.message || "An Error Occurred");
    }
    return response;
  } catch (error) {
    console.error("Error deleting announcement:", error);
    throw error;
  }
}

export async function createClassworkType(formData) {
  return await fetch(`${uri}/api/eduGemini/classroom/createClasswork`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function getClassworkType(roomId) {
  return await fetch(
    `${uri}/api/eduGemini/classroom/getClassworkType/${roomId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },

      withCredentials: true,
      credentials: "include",
    }
  ).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function getClassworks(roomId) {
  return await fetch(`${uri}/api/eduGemini/classwork/getClasswork/${roomId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },

    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function getClassworkInformation(roomId, workId) {
  return await fetch(
    `${uri}/api/eduGemini/classwork/getClasswork/${roomId}/${workId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },

      withCredentials: true,
      credentials: "include",
    }
  ).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

async function deleteClasswork(formData) {
  return await fetch(`${uri}/api/eduGemini/classroom/deleteClassworkType`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function deleteSpecificClasswork(roomId, workId) {
  return await fetch(
    `${uri}/api/eduGemini/classwork/deleteClasswork/${roomId}/${workId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      credentials: "include",
    }
  ).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

//admin
async function loginAdmin(formData) {
  return await fetch(`${uri}/api/eduGemini/ai/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

async function getAllClassAdmin() {
  return await fetch(`${uri}/api/eduGemini/ai/admin/allClass`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

async function approveClass(formData) {
  return await fetch(`${uri}/api/eduGemini/ai/admin/classApproval`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

async function declineClass(formData) {
  return await fetch(`${uri}/api/eduGemini/ai/admin/declineApproval`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

//student
async function joinClass(formData) {
  return await fetch(`${uri}/api/eduGemini/classroom/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function joinedClass(userId) {
  return await fetch(`${uri}/api/eduGemini/classroom/joinedClass/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },

    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

async function acceptJoinStudent(formData) {
  return await fetch(`${uri}/api/eduGemini/classroom/acceptStudent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

async function rejectJoinStudent(formData) {
  return await fetch(`${uri}/api/eduGemini/classroom/rejectStudent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function classwork(workId) {
  return await fetch(`${uri}/api/eduGemini/classwork/classworkData/${workId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
    credentials: "include",
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function getAttachments(roomId, workId, userId) {
  return await fetch(
    `${uri}/api/eduGemini/classwork/getAttachments/${roomId}/${workId}/${userId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
      credentials: "include",
    }
  ).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export const useGetClass = ({ queryFn, onSuccess, onError }) => {
  return useQuery({
    queryKey: ["room"],
    queryFn,
    onError,
    onSuccess,
  });
};

export const useGetAllClass = ({ queryFn, onError, onSuccess }) => {
  return useQuery({
    queryKey: ["classroom"],
    queryFn: queryFn,
    onError,
    onSuccess,
  });
};
export const useRegister = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: register,
    onSuccess,
    onError,
  });
};

export const useLogin = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: login,
    onSuccess,
    onError,
  });
};

export const useLogout = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: logout,
    onError,
    onSuccess,
  });
};

export const useUpdateUser = ({ mutationFn, onSuccess, onError }) => {
  return useMutation({
    mutationFn,
    onSuccess,
    onError,
  });
};

export const useGetUser = ({ onSuccess, onError }) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    onError,
    onSuccess,
  });
};

export const useCreateClassroom = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createClass,
    onError,
    onSuccess,
  });
};

export const useAllClass = ({ userId, onSuccess, onError }) => {
  return useQuery({
    queryKey: ["allClass"],
    queryFn: () => allClass(userId),
    onSuccess,
    onError,
  });
};

export const useCreateAnnouncement = ({ mutationFn, onSuccess, onError }) => {
  return useMutation({
    mutationFn,
    onSuccess,
    onError,
  });
};

export const useGetannouncement = ({ queryFn, onSuccess, onError }) => {
  return useQuery({
    queryKey: ["announcement"],
    queryFn: queryFn,
    onError,
    onSuccess,
  });
};

export const useDeleteAnnouncement = ({ mutationFn, onSuccess, onError }) => {
  return useMutation({
    mutationFn: mutationFn,
    onSuccess,
    onError,
  });
};

export const useCreateClassworkType = ({ onSuccess, onError }) => {
  return useMutation({
    mutationFn: createClassworkType,
    onError,
    onSuccess,
  });
};

export const useGetClassworkType = ({ queryFn, onError, onSuccess }) => {
  return useQuery({
    queryKey: ["classworkType"],
    queryFn,
    onError,
    onSuccess,
  });
};

export const useDeleteClassworkType = ({ onError, onSuccess }) => {
  return useMutation({
    mutationFn: deleteClasswork,
    onError,
    onSuccess,
  });
};

export const useGetClasswork = ({ queryFn, onSuccess, onError }) => {
  return useQuery({
    queryKey: ["classworks"],
    queryFn,
    onError,
    onSuccess,
  });
};

export const useGetClassworkInfo = ({ queryFn, onError, onSuccess }) => {
  return useQuery({
    queryKey: ["classworkInfo"],
    queryFn,
    onError,
    onSuccess,
  });
};

export const useDeleteClasswork = ({ mutationFn, onError, onSuccess }) => {
  return useMutation({
    mutationFn,
    onError,
    onSuccess,
  });
};

//admin
export const useLoginAdmin = ({ onError, onSuccess }) => {
  return useMutation({
    mutationFn: loginAdmin,
    onError,
    onSuccess,
  });
};

export const useGetAllClassAdmin = ({ onError, onSuccess }) => {
  return useQuery({
    queryKey: ["allClassAdmin"],
    queryFn: getAllClassAdmin,
    onError,
    onSuccess,
  });
};

export const useApproveClass = ({ onError, onSuccess }) => {
  return useMutation({
    mutationFn: approveClass,
    onError,
    onSuccess,
  });
};

export const useDeclineClass = ({ onError, onSuccess }) => {
  return useMutation({
    mutationFn: declineClass,
    onError,
    onSuccess,
  });
};

export const useJoinClass = ({ onError, onSuccess }) => {
  return useMutation({
    mutationFn: joinClass,
    onError,
    onSuccess,
  });
};

// export const useGetJoinedClass = ({ queryFn, onError, onSuccess }) => {
//   return useQuery({
//     queryKey: ["joinedClass"],
//     queryFn,
//     onError,
//     onSuccess,
//   });
// };

export const useGetAllClassroom = ({ queryFn, onError, onSuccess }) => {
  return useQuery({
    queryKey: ["allClassroom"],
    queryFn,
    onError,
    onSuccess,
  });
};

export const useAcceptStudentJoin = ({ onError, onSuccess }) => {
  return useMutation({
    mutationFn: acceptJoinStudent,
    onError,
    onSuccess,
  });
};

export const useRejectStudentJoin = ({ onError, onSuccess }) => {
  return useMutation({
    mutationFn: rejectJoinStudent,
    onError,
    onSuccess,
  });
};

export const useGetAttachments = ({ queryFn, onError, onSuccess }) => {
  return useQuery({
    queryKey: ["attachments"],
    queryFn,
    onError,
    onSuccess,
  });
};
