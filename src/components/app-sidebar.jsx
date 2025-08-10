import { Home, Inbox } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
// const items = [
//   {
//     title: "Isometric Gallery Mockup",
//     url: "isometric-mockup",
//   },
//   {
//     title: "",
//     url: "embed-viewer",
//   },
// ]

const items = [
  {
    title: "Isometric Gallery",
    url: "isometric-gallery",
  },
  {
    title: "Screen Decorator",
    url: "screen-decorator",
  },
]

export function AppSidebar({ headerHeight = 56 }) {
  return (
    <Sidebar
      style={{ top: headerHeight, height: `calc(100vh - ${headerHeight}px)` }}
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}