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
    hideAll();

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

    hideAll();

    if (!dist || !al) {
        return;
    }

    $("#mail-content").html(renderTemplate(al.rep + " and " + dist.rep, "Save the Caterpillars!"));

    if (dist.type == "email" && al.type == "email") {
        $("#contact-1").show();
        setMailLink("#link-1", dist.address + "," + al.address, al.rep + " and " + dist.rep);
    } else if (dist.type == "email") {
        $("#contact-2").show();
        setMailLink("#link-2-1", dist.address, dist.rep);
        $("#link-2-2").attr('href', al.address);
    } else {
        $("#contact-3").show();
        $("#link-3-1").attr('href', dist.address);
        $("#link-3-2").attr('href', al.address);
    }

    $("#contact-supervisor-detail").show();
});

function renderTemplate(name, subject) {
    var data = { name: name, subject: subject };
    var tmpl = $.templates("#mail-template");
    return tmpl.render(data);
}

function hideAll() {
    $("#contact-1").hide();
    $("#contact-2").hide();
    $("#contact-3").hide();
    $("#contact-supervisor-detail").hide();
}

function setMailLink(id, emails, names) {
    var emailBody = renderTemplate(names, null);
    emailBody = emailBody.replace(/<br>/g, "%0D%0A");
    var url = "mailto:" + emails;
    url += "?cc=info@audubonva.org";
    url += "&Subject=Save%20the%20Caterpillars!";
    url += "&body=" + emailBody;
    $(id).attr("href", url);
}

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

