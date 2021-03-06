$(document).ready(function() {
	applyClasses();
	$("#page-header").imageScroll({
		mediaWidth: 2048,
		mediaHeight: 915,
		coverRatio: 0.7,
		speed: 0.3,
	});

});


	var requests;
$("body").delegate("a.submit-comment", 'click', function(event){
    // setup some local variables
    var $form = $("#comment-form");
    // let's select and cache all the fields
    var $inputs = $form.find("input, select, button, textarea");
    var postid = $(this).attr('id').substring(1);
    // serialize the data in the form
    var serializedData = $form.serialize();
    // let's disable the inputs for the duration of the ajax request
    $inputs.prop("disabled", true);

    // fire off the request to /form.php
    requests = $.ajax({
        url: "/addcomment/"+postid+"/",
        type: "post",
        data: serializedData
    });

    // callback handler that will be called on success
    requests.done(function (response, textStatus, jqXHR){
        // log a message to the console
        pageRefresh($(response), $('div.comments-container').offset().top-40);
    });

    // callback handler that will be called on failure
    requests.fail(function (jqXHR, textStatus, errorThrown){
        // log the error to the console
        console.error(
            "The following error occured: "+
            textStatus, errorThrown
     );
});

// callback handler that will be called regardless
// if the request failed or succeeded
requests.always(function () {
    // reenable the inputs
    $inputs.prop("disabled", false);
});

// prevent default posting of form
event.preventDefault();
});
$( "body" ).delegate( "a.postnav", 'click', function(e){
	e.preventDefault();
	var urlAjax = $(this).attr('href');
	var postid = $(this).parent('div').attr('id').substring(1);
	$("div.loading-animation").fadeIn("fast");
	$.ajax({
	    url: urlAjax,
	    context: document.body,
	    success: function(response, status, xhr){
		 	var ct = xhr.getResponseHeader("content-type") || "";
	    	//if returned data is HTML (new page), refresh the page
	    	if (ct.indexOf('html') > -1) {
	      		pageRefresh($(response),$('#page-content').position().top-40);
	      		pageMove();
	    	}
	    	//if the returned data is JSON (error, no more pages etc.)
	    	if (ct.indexOf('json') > -1) {
	    		$("div.loading-animation").css("display", "none");
	    		//$( "#divError" ).append('No more pages!');
	    		//$( "#divError" ).show( "fast");
	      // handle json here
	    	} 
	     	//$("#"+postid).after($(response).html());
		}
	});
});
	
$( "body" ).delegate( "a.show-comment", 'click', function(){
	$(this).removeClass("show-comment").addClass("hide-comment");
	$( "div.comment-form" ).fadeIn( "fast");
	var scrollBottom = $(window).scrollTop() + $(window).height() + 500;
	$("html, body").animate({ scrollTop: scrollBottom }, 500, 'easeInOutExpo');
});
$( "body" ).delegate( "a.hide-comment", 'click', function(){
	$( "div.comment-form" ).fadeOut( "fast");	
	$(this).removeClass("hide-comment").addClass("show-comment");
	});
	
$( "body" ).delegate( "a.months-link", 'click', function(){
	$( "div.months" ).fadeIn("fast");
	$(this).removeClass("months-link").addClass("months-link-active");
	
	});
	
$( "body" ).delegate( "a.months-link-active", 'click', function(){
	$( "div.months" ).fadeOut("fast");	
	$(this).removeClass("months-link-active").addClass("months-link");

	});

$("body").delegate("button.btn-month", 'click', function(){
	var href = $(this).attr('href');
	$.ajax({
	    url: href,
	    context: document.body,
	    success: function(response, status, xhr){
	    	pageRefresh($(response),$('#page-content').position().top-40);
	    	$( "div.months" ).fadeOut("fast");	
			$("a.months-link-active").removeClass("months-link-active").addClass("months-link");
		}
	});
});

var stateScr = 1;

$(window).scroll(function(){
	pageMove();
});

$(window).load(function(){
	//on load check where navigation should go and fade in slowly to avoid jarring effect	
	pageMove();
	$("body").css('visibility','visible').hide().fadeIn('slow');
});


$(window).resize(function(){
	pageMove();
});

function pageMove() {
	
	if ($(window).width() < 768){
		$("div.nav-row").css("bottom","0%");
		$("div.nav-row-loader").css("bottom","45%");
	}
	
	else{
	    if ($(window).scrollTop() >= $('#page-content').position().top-($(window).height()*0.4)) {
	    	if (stateScr == 0){
	        	$("div.nav-row, div.nav-row-loader").animate({top : "45%"}, "fast", "easeOutBack" );
	        	stateScr = 1;
	        } 
	    }
	    else {
	    	if(stateScr == 1){ 
	        	$("div.nav-row, div.nav-row-loader").animate({ top : "85%"}, "fast", "easeOutBack" );
	    		stateScr = 0;
	    	}
	    }
	}
}


$("body").delegate("a.post-link", 'click', function(e){
	e.preventDefault();
	var href = $(this).attr('href');
	$.ajax({
	    url: href,
	    context: document.body,
	    success: function(response, status, xhr){
	    	pageRefresh($(response),$('#page-content').position().top-40);
	    	$( "div.months" ).fadeOut("fast");	
			$("a.months-link-active").removeClass("months-link-active").addClass("months-link");
		}
	});
});

function applyClasses(){
	$("pre").addClass("prettyprint linenums");
	$("code").addClass("prettyprint");
	$("div.comment-body").find("table").addClass("table table-condensed");
	PR.prettyPrint();
	$("code").each(function() {
         if ($(this).text() == "") {
                   $(this).html("<code> <code>");
         }  
	});
	$("li.L1, li.L3, li.L5, li.L7, li.L9").css({'background' : '#333333'});
}	

function pageRefresh(content, direction){
	$('#page-content').fadeOut("fast", function(){
   		$('#page-content').html(content);
   		applyClasses();
   		$('#page-content').fadeIn("fast");		   
   		$("html, body").delay(300).animate({ scrollTop: direction}, "fast", 'easeInOutExpo');
	
		});	
	}
	
