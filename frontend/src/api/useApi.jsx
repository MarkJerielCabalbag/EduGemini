import { useQuery, useMutation } from "@tanstack/react-query";
import { baseUrl } from "../baseUrl";
console.log(baseUrl);
async function register(formData) {
  return await fetch(`${baseUrl}/api/eduGemini/register`, {
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
  return await fetch(`${baseUrl}/api/eduGemini/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  }).then(async (res) => {
    const responseData = await res.json();
    if (!res.ok) {
      throw new Error(responseData.message || "An error occured");
    }
    return responseData;
  });
}

// async function login(formData) {
//   return await axios
//     .post(`https://edugemini.onrender.com/api/eduGemini/login`, formData, {
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       withCredentials: true,
//     })
//     .then((response) => {
//       console.log(response.message);
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }

async function logout() {
  return await fetch(`${baseUrl}/api/eduGemini/logout`, {
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

export async function getUser(userId) {
  return await fetch(`${baseUrl}/api/eduGemini/profile/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then(async (res) => {
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response.message || "An Error Occurred");
    }
    return response;
  });
}

export async function getAllClassroom(userId) {
  return await fetch(`${baseUrl}/api/eduGemini/classroom/allClass/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

async function createClass(formData) {
  return await fetch(`${baseUrl}/api/eduGemini/classroom/createClass`, {
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

async function allClass(userId) {
  await fetch(`${baseUrl}/api/eduGemini/classroom/getAllClass/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then(async (res) => {
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response.message || "An Error Occurred");
    }
    return response;
  });
}

export async function fetchAllClassData(userId) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classroom/getAllClass/${userId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  ).then(async (res) => {
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response.message || "An Error Occurred");
    }
    return response;
  });
}

export async function fetchClassData(roomId) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classroom/getCreatedClassroom/${roomId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  ).then(async (res) => {
    const response = await res.json();
    if (!res.ok) {
      throw new Error(response.message || "An Error Occurred");
    }
    return response;
  });
}

export async function createPublicAnnouncement(
  roomId,
  announceId,
  userId,
  comment
) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classroom/comment/${roomId}/${announceId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comment, userId }),
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
    `${baseUrl}/api/eduGemini/classroom/getAnnouncement/${roomId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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
      `${baseUrl}/api/eduGemini/classroom/deleteAnnouncement/${roomId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announceId }),
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
  return await fetch(`${baseUrl}/api/eduGemini/classroom/createClasswork`, {
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

export async function getClassworkType(roomId) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classroom/getClassworkType/${roomId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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
  return await fetch(
    `${baseUrl}/api/eduGemini/classwork/getClasswork/${roomId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  ).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function getClassworkInformation(roomId, workId) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classwork/getClasswork/${roomId}/${workId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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
  return await fetch(`${baseUrl}/api/eduGemini/classroom/deleteClassworkType`, {
    method: "DELETE",
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

export async function deleteSpecificClasswork(roomId, workId) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classwork/deleteClasswork/${roomId}/${workId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
  return await fetch(`${baseUrl}/api/eduGemini/ai/admin/login`, {
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

export async function getAllClassAdmin() {
  return await fetch(`${baseUrl}/api/eduGemini/ai/admin/allClass`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  }).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

async function approveClass(formData) {
  return await fetch(`${baseUrl}/api/eduGemini/ai/admin/classApproval`, {
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
  return await fetch(`${baseUrl}/api/eduGemini/ai/admin/declineApproval`, {
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
  return await fetch(`${baseUrl}/api/eduGemini/classroom/join`, {
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

export async function joinedClass(userId) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classroom/joinedClass/${userId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  ).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

async function acceptJoinStudent(formData) {
  return await fetch(`${baseUrl}/api/eduGemini/classroom/acceptStudent`, {
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

async function rejectJoinStudent(formData) {
  return await fetch(`${baseUrl}/api/eduGemini/classroom/rejectStudent`, {
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

export async function classwork(workId) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classwork/classworkData/${workId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  ).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function getAttachments(roomId, workId, userId) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classwork/getAttachments/${roomId}/${workId}/${userId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  ).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function deleteAttachment(
  filename,
  date,
  timeAction,
  roomId,
  workId,
  userId
) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classwork/deleteAttachment/${roomId}/${workId}/${userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename, date, timeAction }),
    }
  ).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function submitAttachment(
  date,
  timeAction,
  roomId,
  workId,
  userId
) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classwork/submit/${roomId}/${workId}/${userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, timeAction }),
    }
  ).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function cancelSubmition(
  date,
  timeAction,
  roomId,
  workId,
  userId
) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classwork/cancel/${roomId}/${workId}/${userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, timeAction }),
    }
  ).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function acceptLate(roomId, workId, userId) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classwork/late/${roomId}/${workId}/${userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }
  ).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function getListedStudents(workId, roomId) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classwork/students/${workId}/${roomId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  ).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function getAllActivities(roomId) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classwork/allactivities/${roomId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  ).then(async (res) => {
    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message || "An Error Occured");
    }

    return response;
  });
}

export async function addChance(roomId, userId, workId, chances) {
  return await fetch(
    `${baseUrl}/api/eduGemini/classwork/addchance/${workId}/${roomId}/${userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chances }),
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

export const useGetUser = ({ queryFn, onSuccess, onError }) => {
  return useQuery({
    queryKey: ["user"],
    queryFn,
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

export const useAcceptStudentJoin = ({
  onError,
  onSuccess,
  onMutate,
  onSettled,
}) => {
  return useMutation({
    mutationKey: ["acceptStudent"],
    mutationFn: acceptJoinStudent,
    onError,
    onSuccess,
    onMutate,
    onSettled,
  });
};

export const useRejectStudentJoin = ({ onError, onSuccess }) => {
  return useMutation({
    mutationFn: rejectJoinStudent,
    onError,
    onSuccess,
  });
};

export const useGetAttachments = ({
  queryFn,
  onError,
  onSuccess,
  refetchInterval,
}) => {
  return useQuery({
    queryKey: ["attachments"],
    queryFn,
    onError,
    onSuccess,
    refetchInterval,
  });
};

export const useDeleteAttachment = ({ mutationFn, onSuccess, onError }) => {
  return useMutation({
    mutationFn,
    onError,
    onSuccess,
  });
};

export const useSubmitAttachment = ({ mutationFn, onSuccess, onError }) => {
  return useMutation({
    mutationFn,
    onError,
    onSuccess,
  });
};

export const useCancelSubmition = ({ mutationFn, onError, onSuccess }) => {
  return useMutation({
    mutationFn,
    onError,
    onSuccess,
  });
};

export const useGetListedStudent = ({ queryFn, onSuccess, onError }) => {
  return useQuery({
    queryKey: ["listedStudents"],
    queryFn,
    onError,
    onSuccess,
  });
};

export const useGetAllActivities = ({ queryFn, onSuccess, onError }) => {
  return useQuery({
    queryKey: ["allActivities"],
    queryFn,
    onError,
    onSuccess,
  });
};

export const useAddChance = ({ mutationFn, onSuccess, onError }) => {
  return useMutation({
    mutationFn,
    onError,
    onSuccess,
  });
};

export const useAcceptLate = ({ mutationFn, onSuccess, onError }) => {
  return useMutation({
    mutationFn,
    onError,
    onSuccess,
  });
};

export const useCreatePublicAnnouncement = ({
  mutationFn,
  onError,
  onSuccess,
}) => {
  return useMutation({
    mutationFn,
    onError,
    onSuccess,
  });
};
