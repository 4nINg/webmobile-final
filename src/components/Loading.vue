<template>
    <div class="page-loading">
        <div class="loadingcontainer">
            <i id class="loadingicon fa fa-spinner fa-pulse fa-3x fa-fw"></i>
            <h3 style="color:lightcoral;">Loading</h3>
            <h2 style="color:lightcoral;">잠시만 기다려 주세요</h2>
            <p style="color:gray;">이 화면이 지속되면 페이지를 <strong style="color:lightcoral;">새로고침(F5)</strong>해주세요</p>
        </div>     
    </div>
</template>

<style>
    /* page-loading */
.page-loading {
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    position: fixed;
    display: table;
    background-color: whitesmoke;
    z-index: 9999;
    text-align: center;
    
}
 
.page-loading i{
    vertical-align: middle;
    text-align: center;
    display: table-cell;
    font-size: 60px;
}
.loadingicon {
    color: lightcoral;  
    padding : 2%;
}

.loadingcontainer {
    margin-top: 20%;
    font-family: 'Nanum Gothic', sans-serif; 
}
</style>