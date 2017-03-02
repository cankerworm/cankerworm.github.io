$(document).ready(function() {
    var countySelect = $("#county-select");
    countySelect.append($("<option />").val(0).text("(Select County)"));

    for (var i=0; i<counties.length; i++) {
        county = counties[i];
        countySelect.append($("<option />").val(county.id).text(county.name));
    }
});

$("#lookup-district a").click(function() {
    var county = getSelectedCounty();

    if (county) {
        window.open(county.lookupUrl);
    }

    return false;
});

$("#county-select").change(function() {
    var county = getSelectedCounty();
    if (!county) {
        $("#lookup-district").hide();
        return;
    }

    $("#lookup-district").show();

    var districtSelect = $("#district-select");
    districtSelect.empty();
    districtSelect.append($("<option />").val(0).text("(Select District)"));

    for (var i=0; i<county.districts.length; i++) {
        var dist = county.districts[i];

        if (dist.name != "At-Large") {
            districtSelect.append($("<option />").val(dist.id).text(dist.name + " (" + dist.rep + ")"));
        }
    }
});

$("#district-select").change(function() {
    var al = getSelectedAtLarge();
    var dist = getSelectedDistrict();

    $("#contact-supervisor-web").hide();
    $("#contact-supervisor-email").hide();
    $("#contact-supervisor-detail").hide();
    $("#contact-chairman-web").hide();

    if (!dist) {
        return;
    }

    var names = dist.rep;
    var displayNames = dist.rep;
    if (al) {
        displayNames = al.rep + " and " + names;

        if (al.type == "email") {
            names = al.rep + " and " + names;
        } 
    }

    var displayText = $("#mail-template").html().replace("_name_", displayNames);
    var emailBody = $("#mail-template").html().replace("_name_", names);
    emailBody = emailBody.replace(/<br>/g, "%0D%0A");
    $("#mail-content").html(displayText);

    if (dist.type == "email") {
        var url = "mailto:" + dist.address;
        $("#contact-supervisor-email").show();

        if (al.type == "email") {
            url += "," + al.address;
            $("#contact-supervisor-email span").html("Use this link to email your District Chairman and Supervisor. You can review and edit the email before sending:");
            $("#mailto-link").html("E-MAIL MY DISTRICT CHAIRMAN AND SUPERVISOR");
        } else {
            $("#contact-supervisor-email span").html("Use these links to contact your District Chairman and email your District Supervisor. You can review and edit the email before sending:");
            $("#mailto-link").html("E-MAIL MY DISTRICT SUPERVISOR");
            $("#webto-chair-link").attr('href', al.address);
            $("#contact-chairman-web").show();
        }

        url += "?cc=info@audubonva.org";
        url += "&Subject=Save%20the%20Caterpillars!";
        url += "&body=" + emailBody;

        $("#mailto-link").attr("href", url);
    } else {
        $("#webto-rep-link").attr('href', dist.address);
        $("#webto-chair-link").attr('href', al.address);
        $("#contact-supervisor-web").show();
        $("#contact-chairman-web").show();
    }

    $("#contact-supervisor-detail").show();
});

function getSelectedCounty() {
    var id = $("#county-select").val();

    for (var i=0; i<counties.length; i++) {
        county = counties[i];
        if (county.id == id) {
            return county;
        }
    }

    return null;
}

function getSelectedAtLarge() {
    var county = getSelectedCounty();
    if (!county) {
        return null;
    }

    if (county.districts[0].name == "At-Large") {
        return county.districts[0];
    }

    return null;
}

function getSelectedDistrict() {
    var id = $("#district-select").val();

    var county = getSelectedCounty();
    if (!county) {
        return null;
    }

    for (var i=0; i<county.districts.length; i++) {
        var dist = county.districts[i];
        if (dist.id == id) {
            return dist;
        }
    }

    return null;
}

