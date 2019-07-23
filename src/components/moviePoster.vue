<template>
  <div class="posterDiv">
    <img src="@/assets/moon.jpg" />

    <div class="posterContent">
      <h1>제목1</h1>
      <p>내용1</p>
    </div>
  </div>
</template>
<script>
export default {};
</script>

<style>
.posterDiv {
  display: flex;
  width: 80%;
  justify-content: center;
  align-items: center;
  transition: 3s !important;
  margin-left: 10%;
}

.posterDiv img {
  padding: 3em;
  width: 40%;
}

.posterContent {
  width: 40%;
  padding: 3em;
}

.posterContent p {
  margin-top: 1em;
}

.visible {
}
</style>

