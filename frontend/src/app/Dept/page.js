import Topbar from '@/components/Topbar';
import MainHeader from '@/components/MainHeader';
import Navbar from '@/components/Navbar';
import SchoolsAndDepartments from '@/components/SchoolsAndDepartments';
import Footer from '@/components/Footer';

export default function DeptPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <Topbar />
      <MainHeader />
      <Navbar />
      <main className="flex-1">
        <SchoolsAndDepartments />
      </main>
      <Footer />
    </div>
  );
}
