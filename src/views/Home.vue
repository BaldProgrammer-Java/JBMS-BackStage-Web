<template>
  <el-container>
    <el-aside width="200px">
      <SideMenu></SideMenu>
    </el-aside>
    <el-container>
      <el-header>
        <strong>Java后台管理系统</strong>
        <div class="header-avatar">
          <el-avatar size="medium" :src="userInfo.avatar"></el-avatar>
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ userInfo.username }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/userCenter">
                <el-dropdown-item>
                  个人中心
                </el-dropdown-item>
              </router-link>
              <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <Tabs></Tabs>
        <div style="margin: 0 15px;">
          <router-view/>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
import SideMenu from "@/components/SideMenu.vue";
import Tabs from "@/components/Tabs.vue";

export default {
  name: "Home",
  components: {
    SideMenu,
    Tabs
  },
  data() {
    return {
      userInfo: {
        id: "",
        username: "",
        avatar: "",
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      this.$axios.get("/system/userInfo").then(res => {
        this.userInfo = res.data.data
      })
    },
    logout() {
      this.$axios.post("/logout").then(res => {
        localStorage.clear()
        sessionStorage.clear()

        this.$store.commit("resetState")
        this.$router.push("/login")
      })
    },

  }

}
</script>

<style scoped>
.el-container {
  padding: 0;
  margin: 0;
  height: 100%;
}

.header-avatar {
  float: right;
  width: 210px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.el-dropdown-link {
  cursor: pointer;
}

.el-header {
  background-color: lightskyblue;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  line-height: 200px;
}

.el-main {
  color: #333;
  padding: 0;
}

.el-menu-vertical-demo {
  height: 100%;
}

a {
  text-decoration: none;
}
</style>
