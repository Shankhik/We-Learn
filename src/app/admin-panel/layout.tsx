import HomeLayout from "@/components/layouts/HomeLayout";

/* Authorization is done in proxy.ts */
export default async function AdminPanelLayout({children}:{
    children: React.ReactNode
}) {
    return <>
    <HomeLayout activePath={"Admin Panel"}>
        {children}
    </HomeLayout>
    </>
}