<template>
    <div class="no_data_wrapper">
        <img src="../assets/images/no_data.png">
    </div>
</template>
<style lang="scss" scoped>
.no_data_wrapper {
    display: flex;
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%);
    flex-direction: column;
    align-items: center;
    img {
        max-height: 60px;
    }
}
</style>