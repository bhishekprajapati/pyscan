import LinkButton from "@/components/ui/link-button";
import { Plus } from "lucide-react";

const QueryPage = () => (
  <div className="m-4">
    <section>
      <header className="flex items-center justify-between">
        <h2>Recent Queries</h2>
        <LinkButton href="/queries/editor">
          <Plus size={16} /> Query
        </LinkButton>
      </header>
    </section>
  </div>
);

export default QueryPage;
