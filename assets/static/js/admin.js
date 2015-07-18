$(function () {

    $(".mirror-list input").change(function () {
        var $this = $(this);

        $.get("/admin/ajax/set/mirror", {
            id: $this.attr("data-mirror-id"),
            active: $this.is(":checked")
        }, function (res) {
            
        });
    });

})