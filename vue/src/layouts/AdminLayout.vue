<script lang="ts" setup>
import AdminHeader from "@/domains/admin/components/AdminHeader.vue";
import AdminFooter from "@/domains/admin/components/AdminFooter.vue";

</script>
<template>
	<AdminHeader />

	<main>
		<RouterView />
	</main>

	<AdminFooter />
</template>
