export  const ajax = (value) => {
    return $.ajax({
      url: entry + '/app/app_data.php',
			type: 'POST',
			data: value,

      // contentType: false,
      // processData: false,
      // cache: false,
      
		}).done(function(data) {
		}.bind(this)).fail(function() {
      console.log('error');
    });
}
