import { Outlet } from 'react-router-dom';

const ServiceRequestLayout = () => {
    return (
        <main className="max-w-6xl mx-auto px-6 pb-20 mt-8">
            <Outlet />
        </main>
    );
};

export default ServiceRequestLayout;
