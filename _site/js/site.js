$(document).ready(function() {
    var countySelect = $("#county-select");
    countySelect.append($("<option />").val(0).text("(Select County)"));

    for (var i=0; i<counties.length; i++) {
        county = counties[i];
        countySelect.append($("<option />").val(county.id).text(county.name));
    }
});

$("#lookup-supervisor a").click(function() {
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
        districtSelect.append($("<option />").val(dist.id).text(dist.name + " (" + dist.rep + ")"));
    }
});

$("#district-select").change(function() {
    var dist = getSelectedDistrict();

    $("#contact-supervisor-web").hide();
    $("#contact-supervisor-email").hide();
    $("#contact-supervisor-detail").hide();

    if (!dist) {
        return;
    }

    if (dist.type == "email") {
        $("#contact-supervisor-email").show();
        $("#mailto-link").attr("href", "mailto:" + + "?cc=info@audubonva.org&Subject=Save%20the%20Caterpillars!&body=" + $("#mail-template").html());
    } else {
        $("#contact-supervisor-web").show();
    }

    $("#mail-content").html($("#mail-template").html().replace("_name_", dist.rep));
    $("#contact-supervisor-detail").show();
});

$("#mailto-link").click(function() {
    var dist = getSelectedDistrict();
    if (!dist) {
        return;
    }

    var url = "mailto:" + dist.address;
    url += "?cc=info@audubonva.org";
    url += "&Subject=Save%20the%20Caterpillars!";
    url += "&body=" + $("#mail-content").html().replace(/<br>/g, "%0D");

    window.open(url);

    return false;
});

$("#webto-link").click(function() {
    var dist = getSelectedDistrict();
    if (!dist) {
        return;
    }

    window.open(dist.address);
    
    return false;
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

