<nav class="navbar navbar-expand-lg navbar-light bg-light" >
            <div class="container-fluid px- px-lg-5 ">
                <button class="navbar-toggler btn btn-sm" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
                <a class="navbar-brand" href="./">
                <img src="<?php echo validate_image($_settings->info('logo')) ?>" width="100" height="100" class="d-inline-block align-top" alt="" loading="lazy">
                <?php //echo $_settings->info('short_name') ?>
                </a>
                
                
                
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                        <li class="nav-item"><a class="nav-link" aria-current="page" href="./">Home</a></li>
                        <li class="nav-item"><a class="nav-link" href="./?p=view_categories">All Categories</a></li>
                        <li class="nav-item"><a class="nav-link" href="./?p=about">About</a></li>
                        <li class="nav-item"><a class="nav-link" href="./?p=message">Sent Request</a></li>
                    </ul>
                    <div class="d-flex align-items-center">
                      <?php if(!isset($_SESSION['userdata']['id'])): ?>
                        <button class="btn btn-outline-dark ml-2" id="login-btn" type="button">Login</button>
                        <?php else: ?>
                        <a class="text-dark mr-2 nav-link" href="./?p=cart">
                            <i class="bi-cart-fill me-1"></i>
                            Cart
                            <span class="badge bg-dark text-white ms-1 rounded-pill" id="cart-count">
                              <?php 
                              if(isset($_SESSION['userdata']['id'])):
                                $count = $conn->query("SELECT SUM(quantity) as items from `cart` where client_id =".$_settings->userdata('id'))->fetch_assoc()['items'];
                                echo ($count > 0 ? $count : 0);
                              else:
                                echo "0";
                              endif;
                              ?>
                            </span>
                        </a>
                        
                            <a href="./?p=my_account" class="text-dark  nav-link"><b> Hi, <?php echo $_settings->userdata('firstname')?>!</b></a>
                            <a href="logout.php" class="text-dark  nav-link"><button class="btn btn-outline-dark ml-2" id="login-btn" type="button">Logout</button></a>
                        <?php endif; ?>
                    </div>
                </div>
                <form class="form-inline" id="search-form">
                  <div class="input-group">
                    <input class="form-control form-control-sm form " size="50" type="search" placeholder="Search by Author or Book " aria-label="Search" name="search"  value="<?php echo isset($_GET['search']) ? $_GET['search'] : "" ?>"  aria-describedby="button-addon2">
                    <div class="input-group-append">
                      <button class="btn btn-outline-dark btn-sm m-0" type="submit" id="button-addon2"><i class="fa fa-search"> SEARCH</i></button>
                    </div>
                  </div>
                </form>
            </div>
        </nav>
<script>
  $(function(){
    $('#login-btn').click(function(){
      uni_modal("","login.php")
    })
    $('#navbarResponsive').on('show.bs.collapse', function () {
        $('#mainNav').addClass('navbar-shrink')
    })
    $('#navbarResponsive').on('hidden.bs.collapse', function () {
        if($('body').offset.top == 0)
          $('#mainNav').removeClass('navbar-shrink')
    })
  })

  $('#search-form').submit(function(e){
    e.preventDefault()
     var sTxt = $('[name="search"]').val()
     if(sTxt != '')
      location.href = './?p=products&search='+sTxt;
  })
</script>