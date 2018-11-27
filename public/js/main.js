$(function () {
  $('.delete-article').click(function (e) {
    let $target = $(e.target);
    let id = $target.attr('data-id')
    $.ajax({
      type:'DELETE',
      url:'/article/'+id,
      success:function(){
        window.location.href='/';
      },
      error:function(err){
        console.log(err)
      }
    })

  })
})
