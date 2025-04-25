const  deleteItem = async (ID, type) => {
  const token = localStorage.getItem("access_token");
  const formData = new FormData();
  formData.append("type", type);

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/bin_Api/${ID}`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    console.log("Success:", result);

  } catch (err) {
    console.error("Error moving to bin:", err.message);
  }
};

export default deleteItem;