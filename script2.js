$(document).ready(function () {

    // Load saved reviews from localStorage
    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    // Handle review form submission
    $("#reviewForm").submit(function (event) {
        event.preventDefault();

        // Get form values
        let name = $("#reviewerName").val().trim();
        let rating = Number($("#rating").val());
        let reviewText = $("#reviewText").val().trim();

        // Validate input
        if (name === "" || rating < 1 || rating > 5 || reviewText === "") {
            showMessage("Please complete all fields correctly.", "danger");
            return;
        }

        // Create review object
        let review = {
            name: name,
            rating: rating,
            comment: reviewText,
            date: new Date().toLocaleDateString()
        };

        // Add review to array and save
        reviews.push(review);
        localStorage.setItem("reviews", JSON.stringify(reviews));

        displayReviews();

        // Reset form
        $("#reviewForm")[0].reset();

        showMessage("Thank you! Your review was submitted successfully.", "success");
    });

    // Display reviews
    function displayReviews() {
        $("#reviewsList").empty();

        // Empty state
        if (reviews.length === 0) {
            $("#reviewsList").html(`
        <div class="text-center py-4">
          <h5 class="text-secondary">No Reviews Yet</h5>
          <p class="text-secondary mb-0">Be the first to share your experience!</p>
        </div>
      `);
        }

        let totalRating = 0;

        reviews.forEach(function (review, index) {
            totalRating += review.rating;

            // Generate star rating
            let stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);

            // Create review card
            let card = $("<div>").addClass("card border mb-3");
            let cardBody = $("<div>").addClass("card-body");

            // Reviewer name
            let name = $("<h5>").addClass("card-title fw-bold mb-0").text(review.name);

            // Delete button with trash icon
            let deleteButton = $("<button>")
                .addClass("btn btn-outline-danger btn-sm")
                .attr("type", "button")
                .attr("aria-label", "Delete review")
                .attr("title", "Delete review")
                .html('<i class="bi bi-trash"></i>')
                .attr("data-index", index);

            // Name + delete button row
            let header = $("<div>")
                .addClass("d-flex justify-content-between align-items-center mb-2")
                .append(name, deleteButton);

            // Star rating
            let rating = $("<h5>").addClass("text-warning").text(stars);

            // Review comment
            let comment = $("<p>").addClass("card-text").text(review.comment);

            // Review date
            let date = $("<small>").addClass("text-secondary").text("Posted on: " + review.date);

            cardBody.append(header, rating, comment, date);
            card.append(cardBody);
            $("#reviewsList").append(card);
        });

        // Calculate average rating and update summary
        let average = reviews.length > 0 ? totalRating / reviews.length : 0;
        $("#averageRating").text(average.toFixed(1));
        $("#reviewCount").text(reviews.length);
    }

    // Handle delete button click
    $("#reviewsList").on("click", ".btn-outline-danger", function () {
        let index = Number($(this).attr("data-index"));

        reviews.splice(index, 1);
        localStorage.setItem("reviews", JSON.stringify(reviews));

        displayReviews();
        showMessage("Review deleted successfully.", "success");
    });

    // Display feedback message
    function showMessage(message, type) {
        $("#message")
            .removeClass("d-none alert-success alert-danger")
            .addClass("alert-" + type)
            .text(message);
    }

    // Initial display
    displayReviews();
});