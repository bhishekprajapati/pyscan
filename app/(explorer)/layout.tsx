import Footer from "@/components/footer";

const ExplorerLayout = ({ children }: { children: React.ReactNode }) => (
  <div>
    <main>{children}</main>
    <Footer />
  </div>
);

export default ExplorerLayout;
