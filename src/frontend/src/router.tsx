import {
  Link,
  Outlet,
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { AppLayout } from "./components/AppLayout";
import { AboutPage } from "./pages/AboutPage";
import { AdminBookingsPage } from "./pages/AdminBookingsPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { BookingPage } from "./pages/BookingPage";
import { ContactPage } from "./pages/ContactPage";
import { DonatePage } from "./pages/DonatePage";
import { FAQsPage } from "./pages/FAQsPage";
import { GalleryPage } from "./pages/GalleryPage";
import { HomePage } from "./pages/HomePage";
import { MyBookingsPage } from "./pages/MyBookingsPage";
import { ReviewsPage } from "./pages/ReviewsPage";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { ServicesPage } from "./pages/ServicesPage";

const rootRoute = createRootRoute({
  component: function RootComponent() {
    return (
      <AppLayout>
        <Outlet />
      </AppLayout>
    );
  },
  notFoundComponent: function NotFound() {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="font-display text-5xl text-primary">४०४</p>
        <p className="text-muted-foreground">
          यह पृष्ठ उपलब्ध नहीं है · This page doesn't exist.
        </p>
        <Link
          to="/"
          className="text-accent hover:underline text-sm"
          data-ocid="notfound.home_link"
        >
          मुख्य पृष्ठ पर जाएँ · Go home
        </Link>
      </div>
    );
  },
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "about",
  component: AboutPage,
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "services",
  component: ServicesPage,
});

const serviceDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "services/$category",
  component: ServiceDetailPage,
});

const bookingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "booking",
  component: BookingPage,
});

const donateRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "donate",
  component: DonatePage,
});

const myBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "my-bookings",
  component: MyBookingsPage,
});

const adminBookingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "admin/bookings",
  component: AdminBookingsPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "gallery",
  component: GalleryPage,
});

const reviewsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "reviews",
  component: ReviewsPage,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "blog",
  component: BlogPage,
});

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "blog/$slug",
  component: BlogPostPage,
});

const faqsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "faqs",
  component: FAQsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "contact",
  component: ContactPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  servicesRoute,
  serviceDetailRoute,
  bookingRoute,
  donateRoute,
  myBookingsRoute,
  adminBookingsRoute,
  galleryRoute,
  reviewsRoute,
  blogRoute,
  blogPostRoute,
  faqsRoute,
  contactRoute,
]);

export const router = createRouter({
  routeTree,
  history: createHashHistory(),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
