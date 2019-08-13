<template>
    <div class="page-error">
        <div class="errorcontainer">
            <i class="erroricon fas fa-times"></i>
            <h3 style="color:lightcoral;">Error</h3>
            <h2 style="color:lightcoral;">새로고침 후 다시 시도하세요</h2>
            <p style="color:gray;">이 결과가 지속되면 관리자에게 <strong style="color:lightcoral;">문의(T:1234-1234)</strong>해주세요</p>
        </div>
    </div>
</template>

<style>
    /* page-loading */
.page-error {
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

.page-error i{
    vertical-align: middle;
    text-align: center;
    display: table-cell;
    font-size: 60px;
}
.erroricon {
    color: lightcoral;
    padding : 2%;
}

.errorcontainer {
    margin-top: 20%;
    font-family: 'Nanum Gothic', sans-serif;
}
</style>
