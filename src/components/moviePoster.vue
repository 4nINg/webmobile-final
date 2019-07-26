<template>
  <div class="posterDiv">
    <div class="posterInnerDiv">
      <img src="@/assets/moon.jpg" />

      <div class="posterContent">
        <h1>Lorem ipsum</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>

<style>
.posterInnerDiv {
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

.posterDiv {
  display: none;
}
</style>

