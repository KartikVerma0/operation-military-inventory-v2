let iconInput = document.getElementById("equipmentIcon");
let deleteCross = document.getElementById("deleteIcon");

const deleteIcon = async (publicId, view) => {
    try {
        await axios.delete(`/equipments/delete-icon/${publicId}?view=${view}`);
        iconInput.removeAttribute("disabled");
        deleteCross.parentElement.remove();
    } catch (error) {
        console.error("Error deleting image:", error.message);
    }
};

// Call deleteImage with the actual public ID
// e.g., deleteImage('my-image-public-id');

const deleteImage = async (publicId, view, index) => {
    try {
        await axios.delete(`/equipments/delete-image/${publicId}?view=${view}`);
        const deleteIcon = document.getElementById(`deleteIcon${index}`);
        console.log(deleteIcon);
        // const iconInput = document.getElementById("equipmentIcon");
        // deleteIcon.addEventListener("click", () => {
        //     iconInput.removeAttribute("disabled");
        // });
        console.log("Image deleted successfully");
    } catch (error) {
        console.error("Error deleting image:", error.message);
    }
};
