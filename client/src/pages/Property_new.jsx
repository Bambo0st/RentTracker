import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropertyInfo from '../components/PropertyPage/PropertyInfo';
import AddTenantForm from '../components/PropertyPage/AddTenantForm';
import TenantsTable from '../components/PropertyPage/TenantsTable';
import TotalDues from '../components/PropertyPage/TotalDues';  // Make sure this path is correct

function Property() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [property, setProperty] = useState(null);
    const [tenants, setTenants] = useState([]);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await fetch(`/api/property/${id}`);
                if (!res.ok) throw new Error('Failed to fetch the property');
                const data = await res.json();
                setProperty(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchTenants = async () => {
            try {
                const res = await fetch(`/api/property/${id}/tenants`);
                if (!res.ok) {
                    throw new Error(`Failed to fetch tenants for property with ID ${id}`);
                }
                const data = await res.json();
                setTenants(data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProperty();
        fetchTenants();
    }, [id]);

    const handleAddTenant = async (tenantData) => {
        try {
            const res = await fetch(`/api/property/${id}/tenants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(tenantData)
            });
            if (res.ok) {
                const addedTenant = await res.json();
                setTenants([...tenants, addedTenant]);
                setError('');
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'Failed to add tenant');
            }
        } catch (err) {
            setError('Failed to add tenant');
        }
    };

    const handleDeleteTenant = async (tenantId) => {
        try {
            const res = await fetch(`/api/property/${id}/tenants/${tenantId}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                setTenants(tenants.filter(tenant => tenant._id !== tenantId));
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'Failed to delete tenant');
            }
        } catch (err) {
            setError('Failed to delete tenant');
        }
    };

    const handleRecordTransaction = async (tenantId) => {
        try {
            const res = await fetch(`/api/property/${id}/tenants/${tenantId}/record-transaction`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ transactionDetails: 'Details of the transaction' })
            });

            if (res.ok) {
                console.log('Transaction recorded successfully');
            } else {
                const errorData = await res.json();
                setError(errorData.message || 'Failed to record transaction');
            }
        } catch (err) {
            setError('Failed to record transaction');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><div className="text-xl font-semibold">Loading...</div></div>;

    return (
        <div className="container mx-auto p-4">
            <PropertyInfo property={property} />

            <AddTenantForm onAddTenant={handleAddTenant} error={error} />

            <TenantsTable tenants={tenants} onDeleteTenant={handleDeleteTenant} onRecordTransaction={handleRecordTransaction} />

            <TotalDues tenants={tenants} />
        </div>
    );
}

export default Property;
