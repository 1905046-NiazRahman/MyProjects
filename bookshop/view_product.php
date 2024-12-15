<?php 
 $products = $conn->query("SELECT * FROM `products`  where md5(id) = '{$_GET['id']}' ");
 if($products->num_rows > 0){
     foreach($products->fetch_assoc() as $k => $v){
         $$k= stripslashes($v);
     }
    $upload_path = base_app.'/uploads/product_'.$id;
    $img = "";
    if(is_dir($upload_path)){
        $fileO = scandir($upload_path);
        if(isset($fileO[2]))
            $img = "uploads/product_".$id."/".$fileO[2];
        // var_dump($fileO);
    }
    $inventory = $conn->query("SELECT * FROM inventory where product_id = ".$id);
    $inv = array();
    while($ir = $inventory->fetch_assoc()){
        $inv[] = $ir;
    }

    $available=$conn->query("SELECT sum(quantity) as sum FROM order_list where product_id = ".$id);
    $availablee="CALL getStock(.$id);";
                        
    while($irr = $available->fetch_assoc()){
        $invv[] = $irr;
    }
    $available2=$conn->query("SELECT sum(quantity) as sum FROM cart where inventory_id = ".$id);
    $availablee="CALL getOrder(.$id);";
    while($irr2 = $available2->fetch_assoc()){
        $invv2[] = $irr2;
    }
    
 }
 if(isset($_POST['send'])){

    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $msg = mysqli_real_escape_string($conn, $_POST['message']);
 
    $select_message = mysqli_query($conn, "SELECT * FROM `reviews` WHERE name = '$name' AND message = '$msg' AND book_id=".$id) or die('query failed');
    $mssg="CALL messageList('$name',.$id);";
    if(mysqli_num_rows($select_message) > 0){
       $message[] = 'message sent already!';
    }else{
       mysqli_query($conn, "INSERT INTO `reviews`(book_id, name, message) VALUES('$id','$name','$msg')") or die('query failed');
       $message[] = 'message sent successfully!';
    }
}
?>
<section class="py-5">
    <div class="container px-4 px-lg-5 my-5">
    
        <div class="row gx-4 gx-lg-5 align-items-center">
            <div class="col-md-4">
                <img class="card-img-top mb-5 mb-md-0 " loading="lazy" id="display-img" src="<?php echo validate_image($img) ?>" alt="..." />
                <div class="mt-2 row gx-2 gx-lg-3 row-cols-4 row-cols-md-3 row-cols-xl-4 justify-content-start">
                    <?php 
                        foreach($fileO as $k => $img):
                            if(in_array($img,array('.','..')))
                                continue;
                    ?>
                    <div class="col">
                        <a href="javascript:void(0)" class="view-image <?php echo $k == 2 ? "active":'' ?>"><img src="<?php echo validate_image('uploads/product_'.$id.'/'.$img) ?>" loading="lazy"  class="img-thumbnail" alt=""></a>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <div class="col-md-6">
                <!-- <div class="small mb-1">SKU: BST-498</div> -->
                <h1 class="display-5 fw-bolder border-bottom border-primary pb-1"><?php echo $title ?></h1>
                <p class="m-0"><medium>By: <?php echo $author ?></medium></p>
                <div class="fs-5 mb-5">
                Price: <span id="price"><?php echo number_format($inv[0]['price']) ?></span>
                <br>
                <span><medium><b>Available Stock:</b> <span id="avail"><?php echo $inv[0]['quantity']-$invv[0]['sum'] ?></span></medium></span>
                </div>
                <form action="" id="add-cart">
                <div class="d-flex">
                    <input type="hidden" name="price" value="<?php echo $inv[0]['price'] ?>">
                    <input type="hidden" name="inventory_id" value="<?php echo $inv[0]['id'] ?>">
                    <input class="form-control text-center me-3" id="inputQuantity" type="num" value="1" style="max-width: 3rem" name="quantity" />
                    <button class="btn btn-outline-dark flex-shrink-0" type="submit">
                        <i class="bi-cart-fill me-1"></i>
                        Add to cart
                    </button>
                </div>
                </form>
                <p class="lead"><?php echo stripslashes(html_entity_decode($description)) ?></p>
            </div>
        </div>
    </div>
</section>
<section class="contact">
<h1 class="title" align="center"><b> Reviews </b></h1>
<hr class="border-dark">
<hr class="border-dark">
    
   <div class="box-container">
   <?php
      $select_message = mysqli_query($conn, "SELECT * FROM `reviews` WHERE book_id=".$id) or die('query failed');
      if(mysqli_num_rows($select_message) > 0){
         while($fetch_message = mysqli_fetch_assoc($select_message)){
      
   ?>
   <span class="info-box-text"><h1 class="title"> </h1></span>
   <div class="box-container">
   <div class="box">
      <p align="center"> name : <span><?php echo $fetch_message['name']; ?></span> </p>
      <p align="center"> Review : <span><?php echo $fetch_message['message']; ?></span> </p>
      <hr class="border-dark">
   </div>
  </span>
   <?php
      };
   }else{
      echo '';
   }
   ?>
   </div>
</section>
<section class="contact">
   <form action="" method="post">
      <h3>say something!</h3>
      <input type="text" name="name" required placeholder="enter your name" class="box">
      <textarea name="message" class="box" placeholder="enter your review" id="" cols="30" rows="10"></textarea>
      <button class="btn btn-outline-dark flex-shrink-0" type="submit"><input type="submit" value="send review" name="send" class="btn"></button>
   </form>
</section>
<section class="py-5 bg-grey">
    <div class="container px-4 px-lg-5 mt-5">
        <h2 class="fw-bolder mb-4">Related products</h2>
        <div class="row gx-4 gx-lg-5 row-cols-1 row-cols-md-3 row-cols-xl-4 justify-content-center">
        <?php 
            $products = $conn->query("SELECT * FROM `products` where status = 1 and (category_id = '{$category_id}' or sub_category_id = '{$sub_category_id}') and id !='{$id}' order by rand() limit 4 ");
            while($row = $products->fetch_assoc()):
                $upload_path = base_app.'/uploads/product_'.$row['id'];
                $img = "";
                if(is_dir($upload_path)){
                    $fileO = scandir($upload_path);
                    if(isset($fileO[2]))
                        $img = "uploads/product_".$row['id']."/".$fileO[2];
                    // var_dump($fileO);
                }
                $inventory = $conn->query("SELECT * FROM inventory where product_id = ".$row['id']);
                $_inv = array();
                foreach($row as $k=> $v){
                    $row[$k] = trim(stripslashes($v));
                }
                while($ir = $inventory->fetch_assoc()){
                    $_inv[] = number_format($ir['price']);
                }
        ?>
            <div class="col mb-5">
                <div class="card h-100 product-item">
                    <!-- Product image-->
                    <img class="card-img-top w-100" src="<?php echo validate_image($img) ?>" alt="..." />
                    <!-- Product details-->
                    <div class="card-body p-4">
                        <div class="">
                            <!-- Product name-->
                            <h5 class="fw-bolder"><?php echo $row['title'] ?></h5>
                            <!-- Product price-->
                            <?php foreach($_inv as $k=> $v): ?>
                                <span><b>Price: </b><?php echo $v ?></span>
                            <?php endforeach; ?>
                            <p class="m-0"><small>By: <?php echo $row['author'] ?></small></p>
                        </div>
                    </div>
                    <!-- Product actions-->
                    <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
                        <div class="text-center">
                            <a class="btn btn-flat btn-primary "   href=".?p=view_product&id=<?php echo md5($row['id']) ?>">View</a>
                        </div>
                        
                    </div>
                </div>
            </div>
            <?php endwhile; ?>
        </div>
    </div>
</section>


<script>
    var inv = $.parseJSON('<?php echo json_encode($inv) ?>');
    $(function(){
        $('.view-image').click(function(){
            var _img = $(this).find('img').attr('src');
            $('#display-img').attr('src',_img);
            $('.view-image').removeClass("active")
            $(this).addClass("active")
        })
        $('.p-size').click(function(){
            var k = $(this).attr('data-id');
            $('.p-size').removeClass("active")
            $(this).addClass("active")
            $('#price').text(inv[k].price)
            $('[name="price"]').val(inv[k].price)
            $('#avail').text(inv[k].quantity)
            $('[name="inventory_id"]').val(inv[k].id)

        })

        $('#add-cart').submit(function(e){
            e.preventDefault();
            if('<?php echo $_settings->userdata('id') ?>' <= 0){
                uni_modal("","login.php");
                return false;
            }
            if('<?php echo $inv[0]['quantity']-$invv[0]['sum']?>'<= 0){ 
                _conf("Out of Stock Please request this book",'empty_cart',[])      
                return false;
            }
            start_loader();
            $.ajax({
                url:'classes/Master.php?f=add_to_cart',
                data:$(this).serialize(),
                method:'POST',
                dataType:"json",
                error:err=>{
                    console.log(err)
                    alert_toast("an error occured",'error')
                    end_loader()
                },
                success:function(resp){
                    if(typeof resp == 'object' && resp.status=='success'){
                        alert_toast("Product added to cart.",'success')
                        $('#cart-count').text(resp.cart_count)
                    }else{
                        console.log(resp)
                        alert_toast("an error occured",'error')
                    }
                    end_loader();
                }
            })
        })
    })
</script>