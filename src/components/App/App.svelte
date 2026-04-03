<script lang="ts">
  import type { Auth } from "../../lib/Auth.ts";
  import Navbar from "../Navbar/Navbar.svelte";
  export let auth: Auth.UserAuthInfoFront;
  export let godmode: boolean = false;
  export let footerSize: string = "big";
</script>

<div>
  <Navbar avatarUrl="" />
  <slot />
</div>
