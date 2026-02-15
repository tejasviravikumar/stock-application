"""create user table

Revision ID: 4c2debb70b80
Revises: 
Create Date: 2026-02-08 12:36:14.015058

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4c2debb70b80'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table('users',
        sa.Column('id',sa.Integer(),nullable=False,primary_key=True),
        sa.Column('email',sa.String(),nullable=False),
        sa.Column('username',sa.String(),nullable=False),
        sa.Column('password',sa.String(),nullable=False),
        sa.Column('created_at',sa.TIMESTAMP(timezone=True),server_default=sa.text('NOW()'),nullable=False))
    pass


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_table('users')
    pass
